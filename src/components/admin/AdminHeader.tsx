'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, LayoutDashboard, Loader2, Globe } from 'lucide-react';
import { signOutAction } from '@/app/actions/admin_auth';

export default function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // Determine the page title based on the route
    const getPageTitle = () => {
        if (pathname.includes('/redazione')) return 'Redazione';
        if (pathname.includes('/verify')) return 'Verifica';
        if (pathname.includes('/cinema')) return 'Cinema';
        return 'Dashboard';
    };

    const isRootAdmin = pathname === '/admin';
    const isVerifyPage = pathname === '/admin/verify';

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOutAction();
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="h-16 border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
            {/* Left side: Back to Dashboard if not on root */}
            <div className="w-1/3 flex items-center">
                {!isRootAdmin && !isVerifyPage && (
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
            <nav className="w-1/3 flex items-center justify-end gap-3 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest">
                <Link 
                    href="/sphere"
                    className="px-4 py-2 border border-black/5 rounded-full hover:bg-black/5 transition-all flex items-center gap-2 text-black/60 hover:text-black"
                >
                    <Globe size={14} />
                    Sfera
                </Link>
                <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2 bg-black text-white rounded-full hover:bg-black/80 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoggingOut ? <Loader2 size={14} className="animate-spin" /> : <ArrowLeft size={14} />}
                    LOGOUT
                </button>
            </nav>
        </header>
    );
}
