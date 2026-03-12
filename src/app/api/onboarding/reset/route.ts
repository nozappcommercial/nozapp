import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        console.log(`[Reset] Cleaning up data for user ${user.id}`);

        // 1. Delete pillars
        const { error: pErr } = await supabase
            .from("user_pillars")
            .delete()
            .eq("user_id", user.id);

        // 2. Delete results
        const { error: rErr } = await supabase
            .from("user_onboarding_results")
            .delete()
            .eq("user_id", user.id);

        // 3. Mark incomplete
        const { error: uErr } = await supabase
            .from("users")
            .update({ onboarding_complete: false })
            .eq("id", user.id);

        if (pErr || rErr || uErr) {
            console.error("[Reset] Errors during cleanup:", { pErr, rErr, uErr });
            return NextResponse.json({ 
                error: "Cleanup failed", 
                details: { pillars: pErr, results: rErr, user: uErr } 
            }, { status: 500 });
        }

        console.log(`[Reset] User ${user.id} is now fresh.`);
        return NextResponse.json({ success: true, message: "Profilo resettato. Puoi rifare l'onboarding." });
    } catch (err) {
        console.error("[Reset] Fatal error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
