'use server';

import { createClient } from '@/lib/supabase/server';
import { getAdminProfile } from '@/app/actions/admin_auth';

export async function searchFilms(query: string) {
    if (!query || query.length < 2) return { data: [], error: null };

    const supabase = await createClient();
    
    // Auth Check
    const profile = await getAdminProfile();
    if (profile?.role !== 'admin' && profile?.role !== 'redattore') {
        return { data: null, error: 'Non autorizzato' };
    }

    const { data, error } = await supabase
        .from('films')
        .select('id, title, director, year, poster_url')
        .ilike('title', `%${query}%`)
        .limit(10);

    return { data, error: error?.message };
}

export async function getEdgesForFilm(filmId: string) {
    const supabase = await createClient();
    
    // Auth Check
    const profile = await getAdminProfile();
    if (profile?.role !== 'admin' && profile?.role !== 'redattore') {
        return { data: null, error: 'Non autorizzato' };
    }

    // Get edges where the film is either source or target
    // We do two queries or an OR query
    const { data: edgesAsSource, error: err1 } = await supabase
        .from('editorial_edges')
        .select(`
            id, type, label, weight, from_film_id, to_film_id,
            target_film:films!editorial_edges_to_film_id_fkey(id, title, director, year, poster_url)
        `)
        .eq('from_film_id', filmId);

    const { data: edgesAsTarget, error: err2 } = await supabase
        .from('editorial_edges')
        .select(`
            id, type, label, weight, from_film_id, to_film_id,
            source_film:films!editorial_edges_from_film_id_fkey(id, title, director, year, poster_url)
        `)
        .eq('to_film_id', filmId);

    if (err1 || err2) return { data: null, error: err1?.message || err2?.message };

    return {
        data: {
            outgoing: edgesAsSource,
            incoming: edgesAsTarget
        },
        error: null
    };
}

export async function addEditorialEdge(params: {
    from_film_id: string;
    to_film_id: string;
    type: 'thematic' | 'stylistic' | 'contrast';
    label?: string;
    weight?: number;
}) {
    const supabase = await createClient();
    
    // Auth Check
    const profile = await getAdminProfile();
    if (profile?.role !== 'admin' && profile?.role !== 'redattore') {
        return { success: false, error: 'Non autorizzato' };
    }

    if (params.from_film_id === params.to_film_id) {
        return { success: false, error: 'Non puoi collegare un film a sé stesso' };
    }

    // Check if edge already exists
    const { data: existing } = await supabase
        .from('editorial_edges')
        .select('id')
        .eq('from_film_id', params.from_film_id)
        .eq('to_film_id', params.to_film_id)
        .single();
        
    if (existing) {
        return { success: false, error: 'Questo collegamento esiste già' };
    }

    const { error } = await supabase
        .from('editorial_edges')
        .insert({
            from_film_id: params.from_film_id,
            to_film_id: params.to_film_id,
            type: params.type,
            label: params.label || null,
            weight: params.weight || 1.0
        });

    if (error) {
        console.error('[AddEdge] Error:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function deleteEditorialEdge(edgeId: string) {
    const supabase = await createClient();
    
    // Auth Check
    const profile = await getAdminProfile();
    if (profile?.role !== 'admin' && profile?.role !== 'redattore') {
        return { success: false, error: 'Non autorizzato' };
    }

    const { error } = await supabase
        .from('editorial_edges')
        .delete()
        .eq('id', edgeId);

    if (error) {
        console.error('[DeleteEdge] Error:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
