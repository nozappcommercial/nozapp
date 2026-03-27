import React from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, Newspaper, PlusCircle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1a1a1a] flex flex-col font-['Cormorant_Garamond']">
            {/* Dynamic Admin Header */}
            <AdminHeader />

            {/* Sidebar & Content Layout could be here, but for now let's keep it simple */}
            <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
