import React from 'react';
import { notFound } from 'next/navigation';
import ArticleForm from '@/components/admin/ArticleForm';
import { getArticleById } from '@/app/actions/editorial';

interface EditArticlePageProps {
    params: {
        id: string;
    };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const article = await getArticleById(params.id);

    if (!article) {
        notFound();
    }

    return (
        <div className="space-y-12">
            <header>
                <h2 className="text-4xl font-light mb-2">Modifica <em className="text-[var(--gold)] italic">Articolo</em></h2>
                <p className="font-['Fragment_Mono'] text-[11px] uppercase tracking-widest opacity-60">
                    Ultima modifica: {new Date(article.updated_at).toLocaleString('it-IT')}
                </p>
            </header>

            <ArticleForm initialData={article} isEditing />
        </div>
    );
}
