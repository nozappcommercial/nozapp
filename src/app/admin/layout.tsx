'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isVerifyPage = pathname === '/admin/verify';

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1a1a1a] flex flex-col font-['Cormorant_Garamond']">
            {/* Dynamic Admin Header */}
            <AdminHeader />

            <main className={`flex-1 w-full ${isVerifyPage ? '' : 'p-8 md:p-12 max-w-7xl mx-auto'}`}>
                {children}
            </main>
        </div>
    );
}
