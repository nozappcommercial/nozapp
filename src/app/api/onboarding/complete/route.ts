import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = createClient();

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

        // 1. Delete existing pillars for this user (in case of re-onboarding)
        await supabase
            .from("user_pillars")
            .delete()
            .eq("user_id", user.id);

        // 2. Insert new pillars
        if (pillars.length > 0) {
            const pillarRows = pillars.map((p: { filmId: number; rank: number }) => ({
                user_id: user.id,
                film_id: p.filmId,
                rank: p.rank,
            }));

            const { error: pillarError } = await supabase
                .from("user_pillars")
                .insert(pillarRows);

            if (pillarError) {
                console.error("Error inserting pillars:", pillarError);
                return NextResponse.json({ error: "Failed to save pillars" }, { status: 500 });
            }
        }

        // 3. Save full onboarding result JSON (upsert)
        const resultJson = {
            pillars,
            reactions,
            timestamp,
            userId: user.id,
        };

        const { error: resultError } = await supabase
            .from("user_onboarding_results")
            .upsert({
                user_id: user.id,
                result: resultJson,
            }, { onConflict: "user_id" });

        if (resultError) {
            console.error("Error saving onboarding result:", resultError);
            // Non-fatal: pillars already saved
        }

        // 4. Mark onboarding as complete
        const { error: updateError } = await supabase
            .from("users")
            .update({ onboarding_complete: true })
            .eq("id", user.id);

        if (updateError) {
            console.error("Error updating onboarding status:", updateError);
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Onboarding complete error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
