"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DashboardStats {
    totalUsers: number;
    totalClicks: number;
    topArticles: {
        id: string;
        title: string;
        clicks: number;
    }[];
    ageStats: {
        label: string;
        count: number;
    }[];
    countryStats: {
        country: string;
        count: number;
    }[];
    genderStats: {
        label: string;
        count: number;
    }[];
}

/**
 * Fetch analytics data for the dashboard
 */
export async function getDashboardAnalytics(): Promise<DashboardStats> {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    // 1. Safety Check: Only admins can view analytics
    const { data: adminCheck } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', currentUser?.id)
        .single();

    if (!adminCheck?.is_admin) throw new Error("Unauthorized access to analytics");

    // 2. Use Admin Client to bypass RLS for aggregate statistics
    const adminSupabase = createAdminClient();

    // 3. Basic counts
    const { count: userCount } = await adminSupabase.from('users').select('*', { count: 'exact', head: true });
    const { count: clickCount } = await adminSupabase.from('article_analytics').select('*', { count: 'exact', head: true });

    // 4. Top articles (Group by article_id)
    const { data: recentClicks } = await adminSupabase
        .from('article_analytics')
        .select('article_id, articles(title)')
        .limit(1000);

    const articleMap = new Map<string, { title: string, count: number }>();
    recentClicks?.forEach(c => {
        const id = c.article_id;
        const current = articleMap.get(id) || { title: (c.articles as any)?.title || 'Sconosciuto', count: 0 };
        articleMap.set(id, { ...current, count: current.count + 1 });
    });

    const topArticles = Array.from(articleMap.entries())
        .map(([id, val]) => ({ id, title: val.title, clicks: val.count }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

    // 5. Demographics (Age, Country, Gender)
    const { data: usersData } = await adminSupabase.from('users').select('birth_date, country, gender');
    
    const ageGroups = {
        '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0, 'N/A': 0
    };

    const countMap = new Map<string, number>();
    const genderMap = new Map<string, number>();

    usersData?.forEach(u => {
        // Country
        const c = u.country || 'Sconosciuto';
        countMap.set(c, (countMap.get(c) || 0) + 1);

        // Gender
        const g = u.gender || 'Non specificato';
        genderMap.set(g, (genderMap.get(g) || 0) + 1);

        // Age
        if (!u.birth_date) {
            ageGroups['N/A']++;
        } else {
            const birth = new Date(u.birth_date);
            const age = new Date().getFullYear() - birth.getFullYear();
            if (age < 25) ageGroups['18-24']++;
            else if (age < 35) ageGroups['25-34']++;
            else if (age < 45) ageGroups['35-44']++;
            else if (age < 55) ageGroups['45-54']++;
            else ageGroups['55+']++;
        }
    });

    return {
        totalUsers: userCount || 0,
        totalClicks: clickCount || 0,
        topArticles,
        ageStats: Object.entries(ageGroups).map(([label, count]) => ({ label, count })),
        countryStats: Array.from(countMap.entries()).map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count).slice(0, 5),
        genderStats: Array.from(genderMap.entries()).map(([label, count]) => ({ label, count }))
    };
}
