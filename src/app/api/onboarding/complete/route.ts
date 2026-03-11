import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = createClient();

    // Helper for network retries (e.g., UND_ERR_CONNECT_TIMEOUT)
    const fetchWithRetry = async <T>(operation: () => Promise<{ data: T | null, error: any }>, retries = 3, delayMs = 1500) => {
        for (let i = 0; i < retries; i++) {
            try {
                const res = await operation();
                return res; // Return both data and postgres error
            } catch (error: any) {
                console.warn(`[Supabase Network] Operation failed (attempt ${i + 1}/${retries}), retrying...`, error.message || error);
                if (i === retries - 1) throw error;
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
        const { pillars, reactions, timestamp } = body;

        if (!pillars || !Array.isArray(pillars)) {
            return NextResponse.json({ error: "Invalid pillars data" }, { status: 400 });
        }

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
            const pillarRows = pillars.map((p: { filmId: number; rank: number }) => ({
                user_id: user.id,
                film_id: p.filmId,
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

        // 4. Mark onboarding as complete
        console.log(`[Onboarding] Marking user ${user.id} as complete`);
        const { error: updateError } = await fetchWithRetry(async () => await supabase
            .from("users")
            .update({ onboarding_complete: true })
            .eq("id", user.id));

        if (updateError) {
            console.error("[Onboarding] Error updating onboarding status:", updateError);
            return NextResponse.json({ error: `User Update Error: ${updateError.message}` }, { status: 500 });
        }

        console.log(`[Onboarding] Success for user ${user.id}`);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Onboarding complete error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
