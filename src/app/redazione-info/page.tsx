import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Globe, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Footer from '@/components/layout/Footer';

const teamMembers = [
    { name: 'Marco Prencipe', role: 'Direttore Creativo & Tech Lead', bio: 'Visionario digitale, appassionato di linguaggi visuali e architetture semantiche. Guida lo sviluppo tecnologico di NoZapp con un occhio alla bellezza pura.' },
    { name: 'Elena Rossi', role: 'Caporedattrice Editoriale', bio: 'Critica cinematografica con oltre dieci anni di esperienza. Cura la selezione dei contenuti e la profondità dell\'analisi critica.' },
    { name: 'Sandro Bianchi', role: 'Curatore della Sfera', bio: 'Esperto di catalogazione cinematografica. Si occupa delle connessioni tematiche e dei metadati che rendono viva la nostra sfera.' },
    { name: 'Giulia Conti', role: 'Design & Visual Experience', bio: 'Cura l\'estetica del progetto, assicurandosi che ogni pixel trasmetta l\'eleganza e il silenzio visivo che ci contraddistingue.' },
];

export default function RedazioneInfoPage() {
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

            {/* Intro Hero */}
            <section className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto py-20 md:py-32 space-y-12">
                <div className="space-y-6">
                    <ScrollReveal delay={0.1}>
                        <h4 className="font-['Fragment_Mono'] text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-[var(--gold)]">
                            Dietro lo <span className="opacity-50 italic">Schermo</span>
                        </h4>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2} y={50}>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.85] tracking-tight text-[#1a1a1a]">
                            La nostra <br /> <em className="italic font-serif">Redazione.</em>
                        </h1>
                    </ScrollReveal>
                </div>
                <ScrollReveal delay={0.4} y={40}>
                    <p className="text-2xl md:text-4xl font-light leading-relaxed text-[#1a1a1a]/60 max-w-4xl">
                        Un collettivo di sognatori, critici e designer uniti da un'unica missione: restituire al cinema la sua dignità visiva.
                    </p>
                </ScrollReveal>
            </section>

            {/* Team Grid */}
            <section className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
                {teamMembers.map((member, i) => (
                    <ScrollReveal key={i} delay={0.2 + (i * 0.1)} y={60}>
                    <div className="group space-y-8">
                        <div className="relative aspect-[4/5] bg-black/5 rounded-sm overflow-hidden ring-1 ring-black/5 group-hover:ring-black/10 transition-all duration-700">
                            {/* Dummy Profile Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center text-black/5 group-hover:scale-110 transition-transform duration-1000">
                                <User size={200} strokeWidth={0.5} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-3xl md:text-5xl font-light group-hover:text-[var(--gold)] transition-colors duration-500">{member.name}</h3>
                                <p className="font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em] opacity-40">{member.role}</p>
                            </div>
                            <p className="text-xl leading-relaxed text-[#1a1a1a]/70 max-w-md">
                                {member.bio}
                            </p>
                            <div className="flex gap-4 pt-4">
                                <Link href="#" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                                    <Mail size={16} strokeWidth={1.5} />
                                </Link>
                                <Link href="#" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                                    <Globe size={16} strokeWidth={1.5} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    </ScrollReveal>
                ))}
            </section>

            {/* Call to action */}
            <ScrollReveal className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto py-20 mb-20 text-center space-y-12">
                <div className="flex justify-center">
                    <Sparkles className="text-[var(--gold)] opacity-40" size={32} strokeWidth={1} />
                </div>
                <h2 className="text-3xl md:text-5xl font-light">Vuoi unirti alla nostra visione?</h2>
                <div className="flex justify-center">
                    <Link 
                        href="/contatti" 
                        className="px-12 py-4 bg-black text-white text-[10px] font-['Fragment_Mono'] uppercase tracking-[0.4em] rounded-full hover:bg-[var(--gold)] transition-all duration-500"
                    >
                        Invia la tua candidatura
                    </Link>
                </div>
            </ScrollReveal>

            <Footer />
        </main>
    );
}
