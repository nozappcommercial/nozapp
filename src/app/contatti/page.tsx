import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Instagram, MessageCircle, Twitter, Globe } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';

export default function ContattiPage() {
    return (
        <main className="min-h-screen bg-[#faf7f2] font-['Cormorant_Garamond'] selection:bg-[var(--gold)]/20 relative">
            {/* Minimal Header */}
            <header className="pt-12 pb-12 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
                <Link 
                    href="/sphere" 
                    className="inline-flex items-center gap-2 text-[10px] font-['Fragment_Mono'] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity group"
                >
                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
                    Torna alla Sfera
                </Link>
            </header>

            {/* Content Section */}
            <section className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-24">
                <div className="space-y-12">
                    <div className="space-y-6">
                        <ScrollReveal delay={0.1}>
                            <h4 className="font-['Fragment_Mono'] text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-[var(--gold)]">
                                Mettiamoci in <span className="opacity-50 italic">Contatto</span>
                            </h4>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2} y={50}>
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.85] tracking-tight text-[#1a1a1a]">
                                Canali di <br /> <em className="italic font-serif">Dialogo.</em>
                            </h1>
                        </ScrollReveal>
                    </div>
                    
                    <ScrollReveal delay={0.4} y={30}>
                        <p className="text-2xl md:text-3xl font-light leading-relaxed text-[#1a1a1a]/60 max-w-xl">
                            Hai un'idea, una proposta di collaborazione o semplicemente vuoi scambiare due parole sul cinema? Siamo qui per ascoltare.
                        </p>
                    </ScrollReveal>

                    <div className="space-y-8 pt-8">
                        <ScrollReveal delay={0.5} y={20} className="group space-y-2">
                            <p className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.3em] opacity-40">Email Generale</p>
                            <a href="mailto:info@nozapp.com" className="text-3xl md:text-4xl font-light hover:text-[var(--gold)] transition-colors duration-500">info@nozapp.com</a>
                        </ScrollReveal>
                        <ScrollReveal delay={0.6} y={20} className="group space-y-2">
                            <p className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.3em] opacity-40">Proposte Editoriali</p>
                            <a href="mailto:redazione@nozapp.com" className="text-3xl md:text-4xl font-light hover:text-[var(--gold)] transition-colors duration-500">redazione@nozapp.com</a>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Right side - Social links / Dummy Form */}
                <ScrollReveal delay={0.4} className="bg-white/40 p-12 md:p-16 rounded-sm ring-1 ring-black/5 flex flex-col justify-between space-y-16">
                    <div className="space-y-8">
                        <h3 className="text-2xl font-['Fragment_Mono'] uppercase tracking-[0.3em] opacity-30">Social Hub</h3>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { name: 'Instagram', icon: Instagram, handle: '@nozapp_sphere' },
                                { name: 'Letterboxd', icon: MessageCircle, handle: 'NoZapp' },
                                { name: 'Twitter', icon: Twitter, handle: '@nozapp' },
                                { name: 'Substack', icon: Globe, handle: 'NoZapp Editorial' },
                            ].map((social, i) => (
                                <div 
                                    key={social.name}
                                    className="flex items-center justify-between py-6 border-b border-black/5 group cursor-pointer"
                                >
                                    <div className="flex items-center gap-6">
                                        <social.icon size={24} strokeWidth={1} className="text-[var(--gold)] group-hover:scale-110 transition-transform duration-500" />
                                        <div className="space-y-1">
                                            <p className="text-xl font-medium">{social.name}</p>
                                            <p className="font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">{social.handle}</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 border border-black/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                         <Globe size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-black/[0.02] border border-black/5 rounded-sm">
                        <p className="text-sm font-light opacity-60 leading-relaxed italic">
                            NoZapp è un progetto indipendente e autogestito. Rispondiamo a ogni singola email e messaggio non appena lo schermo ce lo permette. Grazie per la pazienza e la visione.
                        </p>
                    </div>
                </ScrollReveal>
            </section>

            <Footer />
            <BackToTop />
        </main>
    );
}
