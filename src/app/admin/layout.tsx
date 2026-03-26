import React from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, Newspaper, PlusCircle } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1a1a1a] flex flex-col font-['Cormorant_Garamond']">
            {/* Admin Header */}
            <header className="h-16 border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/admin" className="p-2 hover:bg-black/5 rounded-full transition-colors group">
                        <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
                    </Link>
                    <h1 className="text-xl font-medium tracking-tight">NoZapp <span className="text-[var(--gold)] italic">Admin</span></h1>
                </div>

                <nav className="flex items-center gap-4 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest">
                    <Link href="/admin/redazione" className="px-4 py-2 hover:bg-black/5 rounded-md transition-colors flex items-center gap-2">
                        <Newspaper size={14} />
                        Redazione
                    </Link>
                    <Link href="/sphere" className="px-4 py-2 bg-black text-white rounded-full hover:bg-black/80 transition-all flex items-center gap-2">
                        <ArrowLeft size={14} />
                        Esci Area Admin
                    </Link>
                </nav>
            </header>

            {/* Sidebar & Content Layout could be here, but for now let's keep it simple */}
            <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
