import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, MessageCircle, ArrowUpRight, Github } from 'lucide-react';

export default function Footer() {
    const socialLinks = [
        { name: 'Instagram', icon: Instagram, href: '#' },
        { name: 'Letterboxd', icon: MessageCircle, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'GitHub', icon: Github, href: '#' },
    ];

    const footerLinks = [
        { name: 'Manifesto', href: '#' },
        { name: 'Redazione', href: '#' },
        { name: 'Archivio', href: '#' },
        { name: 'Contatti', href: '#' },
    ];

    return (
        <footer className="bg-[#1a1a1a] text-white/90 w-full pt-24 pb-12 px-8 md:px-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
                    
                    {/* Brand & Mission */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-none">
                                NoZapp <em className="text-[var(--gold)] italic">Sphere</em>
                            </h2>
                            <p className="font-['Fragment_Mono'] text-[10px] tracking-[0.3em] uppercase opacity-40">
                                Esplorazione visiva del cinema · Dal 1990 ad oggi
                            </p>
                        </div>
                        <p className="text-xl md:text-2xl font-light italic leading-relaxed opacity-60 max-w-md">
                            Un ecosistema digitale dedicato alla scoperta del linguaggio cinematografico attraverso la visione e l'approfondimento.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-3 space-y-8">
                        <h4 className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.4em] opacity-30">Navigazione</h4>
                        <nav className="flex flex-col gap-4">
                            {footerLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    className="text-2xl md:text-3xl font-light hover:text-[var(--gold)] transition-colors inline-flex items-center gap-2 group"
                                >
                                    {link.name}
                                    <ArrowUpRight size={18} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Social & Connect */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <h4 className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.4em] opacity-30">Seguici</h4>
                            <div className="flex gap-4">
                                {socialLinks.map((social) => (
                                    <a 
                                        key={social.name}
                                        href={social.href}
                                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group"
                                        title={social.name}
                                    >
                                        <social.icon size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            <h4 className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.4em] opacity-30">Newsletter</h4>
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    placeholder="La tua email" 
                                    className="w-full bg-white/5 border-b border-white/20 py-4 px-0 outline-none focus:border-[var(--gold)] transition-colors font-['Fragment_Mono'] text-xs font-light"
                                />
                                <button className="absolute right-0 bottom-4 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest text-[var(--gold)]">
                                    Iscriviti
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower Footer */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.2em] opacity-30">
                        © {new Date().getFullYear()} Semantic Sphere. Tutti i diritti riservati.
                    </div>
                    <div className="flex items-center gap-8 font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.2em] opacity-30">
                        <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
                        <a href="#" className="hover:opacity-100 transition-opacity">Cookie Settings</a>
                        <span className="opacity-20">|</span>
                        <span className="lowercase italic opacity-60">Handcrafted by Nozapp</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
