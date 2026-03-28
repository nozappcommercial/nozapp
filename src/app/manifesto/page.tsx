import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Footer from '@/components/layout/Footer';

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-[#faf7f2] font-['Cormorant_Garamond'] selection:bg-[var(--gold)]/20">
            {/* Minimal Header */}
            <header className="pt-24 pb-12 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
                <Link 
                    href="/sphere" 
                    className="inline-flex items-center gap-2 text-[10px] font-['Fragment_Mono'] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity group"
                >
                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
                    Torna alla Sfera
                </Link>
            </header>

            {/* Content Section */}
            <section className="px-8 md:px-16 lg:px-24 max-w-5xl mx-auto py-20 md:py-32 space-y-24">
                <div className="space-y-6">
                    <ScrollReveal delay={0.1}>
                        <h4 className="font-['Fragment_Mono'] text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-[var(--gold)]">
                            Il nostro <span className="opacity-50 italic">Manifesto</span>
                        </h4>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2} y={50}>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.85] tracking-tight text-[#1a1a1a]">
                            Oltre lo <br /> <em className="italic font-serif">Sguardo.</em>
                        </h1>
                    </ScrollReveal>
                </div>

                <ScrollReveal delay={0.4} y={60} className="prose prose-2xl prose-stone max-w-none space-y-12">
                    <p className="text-3xl md:text-5xl font-light leading-snug text-[#1a1a1a]/80 first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left">
                        NoZapp nasce dal desiderio di rallentare. In un'epoca di consumo frenetico e visioni distratte, noi scegliamo la profondità.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-['Fragment_Mono'] uppercase tracking-widest text-[var(--gold)]">Visione Curata</h3>
                            <p className="text-xl leading-relaxed text-[#1a1a1a]/60">
                                Non siamo un catalogo, siamo una selezione. Ogni film, ogni articolo, ogni nodo della nostra sfera è scelto per il suo valore estetico, storico e concettuale. Crediamo che la qualità della visione definisca la qualità del pensiero.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-['Fragment_Mono'] uppercase tracking-widest text-[var(--gold)]">Silenzio Digitale</h3>
                            <p className="text-xl leading-relaxed text-[#1a1a1a]/60">
                                NoZapp è uno spazio privo di rumore. Niente algoritmi di raccomandazione invasivi, niente pubblicità, niente notifiche. Solo tu, la sfera e la bellezza del cinema. Un ecosistema progettato per la contemplazione.
                            </p>
                        </div>
                    </div>

                    <div className="bg-black/5 p-12 md:p-20 rounded-sm border border-black/5 mt-20 italic">
                        <blockquote className="text-2xl md:text-4xl text-center font-light leading-relaxed">
                            "Il cinema è uno specchio di realtà, ma anche un portale verso l'invisibile. Noi costruiamo la chiave."
                        </blockquote>
                    </div>

                    <div className="pt-20 space-y-8">
                        <h2 className="text-4xl font-light">L'Idea Dietro la Sfera</h2>
                        <p className="text-xl md:text-2xl leading-relaxed text-[#1a1a1a]/70">
                            La nostra tecnologia di navigazione semantica non è solo un esercizio di design. È un modo per visualizzare le connessioni invisibili tra le opere. Generi, temi, epoche e sguardi si intrecciano in una costellazione che invita alla scoperta casuale e alla ricerca colta.
                        </p>
                        <p className="text-xl md:text-2xl leading-relaxed text-[#1a1a1a]/70">
                            NoZapp è, in definitiva, un atto di resistenza culturale. Un ritorno a un web più lento, più bello e più umano.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="flex justify-center pt-20">
                    <div className="w-px h-32 bg-gradient-to-b from-[var(--gold)] to-transparent" />
                </div>
            </section>

            <Footer />
        </main>
    );
}
