'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, LayoutDashboard, Loader2, Globe, LogOut, RefreshCw } from 'lucide-react';
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

    const handleGlobalRefresh = () => {
        // Dispatch custom event to let Client components know they should re-fetch
        const event = new CustomEvent('nozapp-admin-refresh');
        window.dispatchEvent(event);
        
        // Refresh the current route to revalidate Server components
        router.refresh();
    };

    return (
        <header className="h-auto min-h-16 border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between pt-[env(safe-area-inset-top,12px)] pb-2 md:pb-0">
            <div className="w-1/4 md:w-1/3 flex items-center gap-2">
                {!isRootAdmin && !isVerifyPage && (
                    <>
                        <Link 
                            href="/admin" 
                            className="flex items-center gap-2 text-[10px] font-['Fragment_Mono'] uppercase tracking-widest text-black/40 hover:text-black transition-colors group"
                            title="Torna alla Dashboard"
                        >
                            <div className="w-10 h-10 md:w-auto md:h-auto rounded-full bg-black/5 flex items-center justify-center md:bg-transparent transition-all">
                                <LayoutDashboard size={14} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="hidden md:inline">Dashboard</span>
                        </Link>
                        
                        <button 
                            onClick={handleGlobalRefresh}
                            className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/40 hover:text-black hover:bg-black/10 transition-all group"
                            title="Ricarica Pagina"
                        >
                            <RefreshCw size={14} className="group-active:rotate-180 transition-transform duration-500" />
                        </button>
                    </>
                )}
            </div>

            <div className="w-2/4 md:w-1/3 flex justify-center text-center">
                <h1 className="text-lg md:text-xl font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    NoZapp <span className="text-[var(--gold)] italic">{getPageTitle()}</span>
                </h1>
            </div>

            <nav className="w-1/4 md:w-1/3 flex items-center justify-end gap-2 md:gap-3 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest">
                <Link 
                    href="/sphere"
                    className="w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 border border-black/5 rounded-full hover:bg-black/5 transition-all flex items-center justify-center md:gap-2 text-black/60 hover:text-black"
                    title="Torna alla Sfera"
                >
                    <Globe size={14} />
                    <span className="hidden md:inline">Sfera</span>
                </Link>
                <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-600 hover:text-white transition-all flex items-center justify-center md:gap-2 disabled:opacity-50"
                    title="Logout"
                >
                    {isLoggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                    <span className="hidden md:inline">LOGOUT</span>
                </button>
            </nav>
        </header>
    );
}
