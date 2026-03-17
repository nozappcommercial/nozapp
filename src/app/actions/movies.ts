"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type InteractionType = 'seen' | 'liked' | 'ignored';

/**
 * MOVIE INTERACTION ACTION
 * -------------------------
 * Handles persistent user feedback for specifically selected films.
 * This includes "seen", "liked", and "ignored" statuses.
 * The data is stored in 'user_film_interactions' and used to color nodes in the sphere.
 */
export async function upsertMovieInteraction(filmId: number, type: InteractionType | null) {
  const supabase = await createClient();

  // 1. AUTHENTICATION
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (type === null) {
    // 2. TOGGLE OFF: Delete interaction if type is null
    const { error } = await supabase
      .from('user_film_interactions')
      .delete()
      .eq('user_id', user.id)
      .eq('film_id', filmId);
    
    if (error) throw error;
  } else {
    // 3. TOGGLE ON/UPDATE: Upsert interaction
    // We use onConflict to ensure only one interaction exists per user/film pair.
    const { error } = await supabase
      .from('user_film_interactions')
      .upsert({
        user_id: user.id,
        film_id: filmId,
        interaction_type: type,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,film_id'
      });

    if (error) throw error;
  }

  // 4. CACHE INVALIDATION
  // Revalidate the sphere page to ensure the nodes update their colors on next load.
  revalidatePath('/sphere');
  
  return { success: true };
}

