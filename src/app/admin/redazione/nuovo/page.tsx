import React from 'react';
import ArticleForm from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
    return (
        <div className="space-y-12">
            <header>
                <h2 className="text-4xl font-light mb-2">Nuovo <em className="text-[var(--gold)] italic">Articolo</em></h2>
                <p className="font-['Fragment_Mono'] text-[11px] uppercase tracking-widest opacity-60">
                    Stai creando un nuovo approfondimento editoriale.
                </p>
            </header>

            <ArticleForm />
        </div>
    );
}
