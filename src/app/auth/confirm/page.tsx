'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ConfirmPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#F2EDE3] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] contrast-125 z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-md w-full text-center z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 bg-[#B8895A]/10 text-[#B8895A] rounded-full text-[10px] tracking-[0.2em] uppercase font-mono mb-2">
            Verifica Completata
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1614] leading-tight">
            Utenza <em className="italic font-medium">verificata</em><br />con successo
          </h1>
          <p className="text-[#4A4440] font-serif text-lg md:text-xl opacity-80 max-w-[280px] mx-auto leading-relaxed">
            La tua porta sulla Sfera Semantica è ora aperta.
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/login"
            className="inline-block bg-[#1A1614] text-[#F2EDE3] px-10 py-4 rounded-full text-sm tracking-[0.1em] uppercase hover:bg-[#B8895A] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-black/5"
          >
            Accedi ora →
          </Link>
        </div>

        <div className="pt-12 opacity-30">
          <div className="w-px h-16 bg-[#1A1614] mx-auto"></div>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#B8895A]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-[#1A1614]/5 blur-[100px] pointer-events-none"></div>
    </main>
  );
}
