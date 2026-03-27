'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function AdminHeader() {
    const pathname = usePathname();
    
    // Determine the page title based on the route
    const getPageTitle = () => {
        if (pathname.includes('/redazione')) return 'Redazione';
        if (pathname.includes('/verify')) return 'Verifica';
        return 'Dashboard';
    };

    const isRootAdmin = pathname === '/admin';

    return (
        <header className="h-16 border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
            {/* Left side: Back to Dashboard if not on root */}
            <div className="w-1/3 flex items-center">
                {!isRootAdmin && (
                    <Link 
                        href="/admin" 
                        className="flex items-center gap-2 text-[10px] font-['Fragment_Mono'] uppercase tracking-widest text-black/40 hover:text-black transition-colors group"
                    >
                        <LayoutDashboard size={14} className="group-hover:scale-110 transition-transform" />
                        Torna alla Dashboard
                    </Link>
                )}
            </div>

            {/* Center: Dynamic Title */}
            <div className="w-1/3 flex justify-center">
                <h1 className="text-xl font-medium tracking-tight whitespace-nowrap">
                    NoZapp <span className="text-[var(--gold)] italic">{getPageTitle()}</span>
                </h1>
            </div>

            {/* Right side: Logout */}
            <nav className="w-1/3 flex items-center justify-end gap-4 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest">
                <Link 
                    href="/login" 
                    className="px-4 py-2 bg-black text-white rounded-full hover:bg-black/80 transition-all flex items-center gap-2"
                >
                    <ArrowLeft size={14} />
                    LOGOUT
                </Link>
            </nav>
        </header>
    );
}
