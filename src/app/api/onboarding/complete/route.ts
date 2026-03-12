import { createClient, createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const OnboardingSchema = z.object({
    pillars: z.array(z.object({
        filmId: z.union([z.string(), z.number()]),
        rank: z.number().int().min(1)
    })).min(1),
    reactions: z.record(z.string(), z.any()).optional(),
    timestamp: z.string().optional()
});

export async function POST(request: Request) {
    const supabase = createClient();

    // Helper for network retries (e.g., UND_ERR_CONNECT_TIMEOUT)
    const fetchWithRetry = async <T>(operation: () => Promise<{ data: T | null, error: any }>, retries = 3, delayMs = 1500) => {
        for (let i = 0; i < retries; i++) {
            try {
                const res = await operation();
                if (res.error) {
                    const msg = (res.error.message || "").toLowerCase();
                    const code = (res.error.code || "").toLowerCase();
                    if (msg.includes("fetch") || msg.includes("timeout") || msg.includes("network") || code === 'und_err_connect_timeout') {
                        throw res.error; // Force retry
                    }
                }
                return res; // Return both data and postgres error
            } catch (error: any) {
                console.warn(`[Supabase Network] Operation failed (attempt ${i + 1}/${retries}), retrying...`, error.message || error);
                if (i === retries - 1) return { data: null, error };
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
        return { data: null, error: new Error("Unreachable") };
    };

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const parsed = OnboardingSchema.safeParse(body);

        if (!parsed.success) {
            console.error("[Onboarding] Validation failed:", JSON.stringify(parsed.error.format(), null, 2));
            return NextResponse.json({ error: "Invalid payload", details: parsed.error.format() }, { status: 400 });
        }

        const { pillars, reactions, timestamp } = parsed.data;

        // 2. Delete old pillars and insert new ones
        console.log(`[Onboarding] Saving ${pillars.length} pillars for user ${user.id}`);

        // Delete existing to avoid duplicates or leftovers
        const { error: deleteError } = await fetchWithRetry(async () => await supabase
            .from("user_pillars")
            .delete()
            .eq("user_id", user.id));

        if (deleteError) {
            console.error("[Onboarding] Error deleting old pillars:", deleteError);
        }

        if (pillars.length > 0) {
            const pillarRows = pillars.map((p: { filmId: string | number; rank: number }) => ({
                user_id: user.id,
                film_id: String(p.filmId),
                rank: p.rank,
            }));

            const { error: pillarError } = await fetchWithRetry(async () => await supabase
                .from("user_pillars")
                .insert(pillarRows));

            if (pillarError) {
                console.error("[Onboarding] Error inserting pillars:", pillarError);
                return NextResponse.json({ error: `Pillar Error: ${pillarError.message} (${pillarError.code})` }, { status: 500 });
            }
        }

        // 3. Save full onboarding result JSON (upsert)
        const resultJson = {
            pillars,
            reactions,
            timestamp,
            userId: user.id,
        };

        const { error: resultError } = await fetchWithRetry(async () => await supabase
            .from("user_onboarding_results")
            .upsert({
                user_id: user.id,
                result: resultJson,
            }, { onConflict: "user_id" }));

        if (resultError) {
            console.error("[Onboarding] Error saving onboarding result:", resultError);
            return NextResponse.json({ error: `JSON Error: ${resultError.message}` }, { status: 500 });
        }

        const adminSupabase = createAdminClient();
        const { error: updateError, data: updateData } = await fetchWithRetry(async () => await adminSupabase
            .from("users")
            .upsert({ 
                id: user.id, 
                onboarding_complete: true 
            }, { onConflict: "id" })
            .select());

        if (updateError) {
            console.error(`[Onboarding] Error upserting onboarding status for ${user.id}:`, updateError);
            return NextResponse.json({ error: `User Update Error: ${updateError.message}` }, { status: 500 });
        }

        console.log(`[Onboarding] Success for user ${user.id}. Update result data:`, updateData);

        console.log(`[Onboarding] Success for user ${user.id}`);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Onboarding complete error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
