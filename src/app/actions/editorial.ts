'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Database } from '@/types/supabase';

// Helper to check if user is admin
async function checkAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data: profile } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    return !!profile?.is_admin;
}

const ArticleSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, 'Il titolo è obbligatorio'),
    slug: z.string().min(1, 'Lo slug è obbligatorio').regex(/^[a-z0-9-]+$/, 'Slug non valido'),
    content: z.string().min(1, 'Il contenuto è obbligatorio'),
    excerpt: z.string().optional(),
    cover_image: z.string().url('URL non valido').or(z.literal('')).optional(),
    status: z.enum(['draft', 'published']),
    published_at: z.string().optional(),
    expires_at: z.string().optional().nullable(),
});

export async function upsertArticle(formData: z.infer<typeof ArticleSchema>) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error('Non autorizzato');

    const validatedData = ArticleSchema.parse(formData);
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    const articleData = {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt || null,
        cover_image: validatedData.cover_image || null,
        status: validatedData.status,
        author_id: user?.id,
        published_at: validatedData.published_at || new Date().toISOString(),
        expires_at: validatedData.expires_at || null,
    };

    let error;
    if (validatedData.id) {
        const { error: updateError } = await supabase
            .from('articles')
            .update(articleData)
            .eq('id', validatedData.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from('articles')
            .insert(articleData);
        error = insertError;
    }

    if (error) {
        console.error('Error upserting article:', error);
        throw new Error('Errore durante il salvataggio dell\'articolo');
    }

    revalidatePath('/admin/redazione');
    revalidatePath('/redazione');
    revalidatePath('/sphere'); // Because of EditorialSection
    return { success: true };
}

export async function deleteArticle(id: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error('Non autorizzato');

    const supabase = await createClient();
    const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting article:', error);
        throw new Error('Errore durante l\'eliminazione dell\'articolo');
    }

    revalidatePath('/admin/redazione');
    revalidatePath('/redazione');
    revalidatePath('/sphere');
    return { success: true };
}

export async function getArticlesAdmin() {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error('Non autorizzato');

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('articles')
        .select(`
            *,
            author:users(display_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching articles admin:', error);
        return [];
    }

    return data;
}

export async function getArticleById(id: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error('Non autorizzato');

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching article by id:', error);
        return null;
    }

    return data;
}

export async function getPublishedArticles() {
    const supabase = await createClient();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
        .from('articles')
        .select(`
            id, title, slug, excerpt, cover_image, published_at,
            author:users(display_name)
        `)
        .eq('status', 'published')
        .lte('published_at', now)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching published articles:', error);
        return [];
    }

    return data as any;
}

export async function getArticleBySlug(slug: string) {
    const supabase = await createClient();
    const now = new Date().toISOString();

    // First, check if the current user is an admin
    const { data: { user } } = await supabase.auth.getUser();
    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', user.id)
            .single();
        isAdmin = !!profile?.is_admin;
    }

    let query = supabase
        .from('articles')
        .select(`
            *,
            author:users(display_name)
        `)
        .eq('slug', slug);

    // If NOT admin, apply publication filters
    if (!isAdmin) {
        query = query
            .eq('status', 'published')
            .lte('published_at', now)
            .or(`expires_at.is.null,expires_at.gt.${now}`);
    }

    const { data, error } = await query.single();

    if (error) {
        if (error.code !== 'PGRST116') { // Ignore "no rows found" console error
            console.error('Error fetching article by slug:', error);
        }
        return null;
    }

    return data as any;
}

/**
 * Fetch non-scheduled articles for the archive (includes expired)
 */
export async function getArchivedArticles() {
    const supabase = await createClient();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
        .from('articles')
        .select(`
            id, title, slug, excerpt, cover_image, published_at, expires_at,
            author:users(display_name)
        `)
        .eq('status', 'published')
        .lte('published_at', now)
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching archived articles:', error);
        return [];
    }

    return data as any;
}
