'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Helper to check if user is admin
async function checkAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    return profile?.role === 'admin' || profile?.role === 'redattore';
}

const CinemaMovieSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, 'Il titolo è obbligatorio'),
    director: z.string().min(1, 'Il regista è obbligatorio'),
    year: z.number().int().min(1800).max(2100),
    poster_url: z.string().url('URL non valido').or(z.literal('')).optional().nullable(),
    themes: z.array(z.string()).default([]),
    expires_at: z.string().min(1, 'La data di scadenza è obbligatoria'),
});

export type CinemaMovieFormData = z.infer<typeof CinemaMovieSchema>;

export async function upsertCinemaMovie(formData: CinemaMovieFormData) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error('Non autorizzato');

    const validatedData = CinemaMovieSchema.parse(formData);
    const supabase = await createClient();

    const movieData = {
        title: validatedData.title,
        director: validatedData.director,
        year: validatedData.year,
        poster_url: validatedData.poster_url || null,
        themes: validatedData.themes,
        expires_at: validatedData.expires_at,
    };

    let error;
    if (validatedData.id) {
        const { error: updateError } = await supabase
            .from('cinema_movies')
            .update(movieData)
            .eq('id', validatedData.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from('cinema_movies')
            .insert(movieData);
        error = insertError;
    }

    if (error) {
        console.error('Error upserting cinema movie:', error);
        throw new Error('Errore durante il salvataggio del film');
    }

    revalidatePath('/admin/cinema');
    revalidatePath('/sphere');
    return { success: true };
}

export async function deleteCinemaMovie(id: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error('Non autorizzato');

    const supabase = await createClient();
    const { error } = await supabase
        .from('cinema_movies')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting cinema movie:', error);
        throw new Error('Errore durante l\'eliminazione del film');
    }

    revalidatePath('/admin/cinema');
    revalidatePath('/sphere');
    return { success: true };
}

export async function getCinemaMoviesAdmin() {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error('Non autorizzato');

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cinema_movies')
        .select('*')
        .order('expires_at', { ascending: false });

    if (error) {
        console.error('Error fetching cinema movies admin:', error);
        return [];
    }

    return data;
}

export async function getCinemaMovieById(id: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error('Non autorizzato');

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cinema_movies')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching cinema movie by id:', error);
        return null;
    }

    return data;
}

export async function getCinemaMoviesPublic() {
    const supabase = await createClient();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
        .from('cinema_movies')
        .select('*')
        .gt('expires_at', now)
        .order('expires_at', { ascending: true });

    if (error) {
        console.error('Error fetching public cinema movies:', error);
        return [];
    }

    return data;
}
