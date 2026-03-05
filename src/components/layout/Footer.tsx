export default function Footer() {
    return (
        <footer className="bg-[var(--surface)] text-[var(--bg)] w-full py-12 px-8 md:px-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <div className="max-w-[1400px] mx-auto border-t border-black/10 pt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

                {/* Brand */}
                <div className="flex flex-col">
                    <h2 className="text-3xl font-light mb-2 text-[var(--gold)]">
                        Semantic <em className="italic">Sphere</em>
                    </h2>
                    <p className="font-['Fragment_Mono'] text-[10px] tracking-widest uppercase opacity-60">
                        Esplorazione visiva del cinema · Dal 1990 ad oggi
                    </p>
                </div>

                {/* Links */}
                <div className="flex gap-8 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest">
                    <a href="#" className="hover:text-[var(--gold)] transition-colors">Manifesto</a>
                    <a href="#" className="hover:text-[var(--gold)] transition-colors">La Redazione</a>
                    <a href="#" className="hover:text-[var(--gold)] transition-colors">Contatti</a>
                </div>

            </div>

            {/* Copyright */}
            <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-black/5 flex justify-between items-center font-['Fragment_Mono'] text-[9px] uppercase tracking-[0.2em] opacity-40">
                <span>© {new Date().getFullYear()} Semantic Sphere. Tutti i diritti riservati.</span>
                <span>Made by Nozapp</span>
            </div>
        </footer>
    );
}
