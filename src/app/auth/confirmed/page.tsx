import Link from 'next/link';

export default function ConfirmedPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="z-10 flex flex-col items-center space-y-6 max-w-sm">
        {/* Minimal Logo Placeholder/Icon */}
        <div className="mb-4">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" stroke="#1A1614" strokeWidth="1" />
            <circle cx="50" cy="50" r="12" fill="#B8895A" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-[#1A1614] tracking-tight">
          Email confermata.
        </h1>
        
        <p className="font-serif text-[#4A4440] opacity-80 leading-relaxed italic">
          Il tuo account è stato verificato con successo.
        </p>

        <div className="pt-6">
          <Link 
            href="/login"
            className="inline-block bg-[#1A1614] text-[#F2EDE3] px-12 py-4 rounded-full text-xs tracking-[0.2em] font-mono uppercase hover:bg-[#B8895A] transition-all duration-300"
          >
            Accedi
          </Link>
        </div>
      </div>
    </main>
  );
}
