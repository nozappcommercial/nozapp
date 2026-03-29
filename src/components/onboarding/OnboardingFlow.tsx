"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { OnboardingFilm } from "@/app/onboarding/page";

/* ─── Constants ─────────────────────────────────────────────────── */
const MAX_PILLARS = 6;
type Reaction = "loved" | "disliked" | "seen" | "unseen";
type Phase = "welcome" | "evaluation" | "confirm" | "streaming" | "demographics" | "done";

const STREAMING_PLATFORMS = [
  { id: "Netflix", name: "Netflix" },
  { id: "Prime Video", name: "Prime Video" },
  { id: "Disney+", name: "Disney+" },
  { id: "Apple TV", name: "Apple TV" },
  { id: "Now", name: "Now" },
  { id: "Paramount+", name: "Paramount+" },
  { id: "HG TV", name: "HG TV" },
  { id: "Mubi", name: "Mubi" },
  { id: "Crunchyroll", name: "Crunchyroll" },
  { id: "RaiPlay", name: "RaiPlay" }
];

interface OnboardingFlowProps {
  films: OnboardingFilm[];
}

export default function OnboardingFlow({ films }: OnboardingFlowProps) {
  const isMobile = useIsMobile(640);
  const [mounted, setMounted] = useState(false);

  // --- Core State ---
  const [phase, setPhase] = useState<Phase>("welcome");
  const [filmIndex, setFilmIndex] = useState(0);
  const [reactions, setReactions] = useState<Record<number, Reaction>>({});
  const [pillars, setPillars] = useState<(OnboardingFilm | null)[]>(Array(MAX_PILLARS).fill(null));
  const [selectedSwap, setSelectedSwap] = useState<{ film: OnboardingFilm; source: 'pillar' | 'gallery'; index?: number } | null>(null);
  
  // --- Form State ---
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("Italia");
  const [gender, setGender] = useState("Non specificato");
  
  // --- UI Helpers ---
  const [fadeIn, setFadeIn] = useState(true);
  const [cardAnim, setCardAnim] = useState("idle");

  useEffect(() => setMounted(true), []);

  // --- Derived Data ---
  const lovedFilms = useMemo(() => films.filter(f => reactions[f.id] === "loved"), [films, reactions]);
  const currentFilm = films[filmIndex];
  const isLastFilm = filmIndex === films.length - 1;

  // --- Transitions ---
  const pageTransition = useCallback((fn: () => void) => {
    setFadeIn(false);
    setTimeout(() => { fn(); setFadeIn(true); }, 300);
  }, []);

  const animateCard = (type: string, afterFn: () => void) => {
    setCardAnim(`exit-${type}`);
    setTimeout(() => {
      afterFn();
      setCardAnim("enter");
      setTimeout(() => setCardAnim("idle"), 250);
    }, 250);
  };

  // --- Phase 1: Evaluation ---
  const handleReaction = (key: Reaction) => {
    animateCard(key, () => {
      setReactions(prev => {
        const next = { ...prev, [currentFilm.id]: key };
        
        // Auto-fill pillars if "loved"
        if (key === "loved") {
          const emptyIdx = pillars.findIndex(p => p === null);
          if (emptyIdx !== -1) {
            const nextPillars = [...pillars];
            nextPillars[emptyIdx] = currentFilm;
            setPillars(nextPillars);
          }
        }
        return next;
      });

      if (isLastFilm) {
        pageTransition(() => setPhase("confirm"));
      } else {
        setFilmIndex(i => i + 1);
      }
    });
  };

  // --- Phase 2: Confirm & Swap ---
  const galleryFilms = useMemo(() => {
    return lovedFilms.filter(f => !pillars.find(p => p?.id === f.id));
  }, [lovedFilms, pillars]);

  const handleSwap = (clickedFilm: OnboardingFilm, source: 'pillar' | 'gallery', pillarIdx?: number) => {
    if (!selectedSwap) {
      setSelectedSwap({ film: clickedFilm, source, index: pillarIdx });
      return;
    }

    if (selectedSwap.film.id === clickedFilm.id) {
      setSelectedSwap(null);
      return;
    }

    const nextPillars = [...pillars];
    if (selectedSwap.source === 'pillar' && source === 'pillar') {
      const temp = nextPillars[selectedSwap.index!];
      nextPillars[selectedSwap.index!] = nextPillars[pillarIdx!];
      nextPillars[pillarIdx!] = temp;
    } else if (selectedSwap.source === 'gallery' && source === 'pillar') {
      nextPillars[pillarIdx!] = selectedSwap.film;
    } else if (selectedSwap.source === 'pillar' && source === 'gallery') {
      nextPillars[selectedSwap.index!] = clickedFilm;
    }
    
    setPillars(nextPillars);
    setSelectedSwap(null);
  };

  const handleFinalSave = async () => {
    setFadeIn(false);
    try {
      const payload = {
        pillars: pillars.filter(p => p !== null).map((p, i) => ({ filmId: p!.id, title: p!.title, rank: i + 1 })),
        reactions,
        streaming_subscriptions: subscriptions,
        birth_date: birthDate,
        country,
        gender
      };

      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) pageTransition(() => setPhase("done"));
      else alert("Errore nel salvataggio. Riprova.");
    } catch (e) {
      console.error(e);
      alert("Errore di rete.");
    } finally {
      setFadeIn(true);
    }
  };

  const filmCardStyle = useCallback((film: OnboardingFilm) => {
    if (film.poster_url) {
      return { 
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%), url(${film.poster_url})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center" 
      };
    }
    return { background: `linear-gradient(135deg, ${film.color_primary || '#222'} 0%, ${film.color_accent || '#444'} 100%)` };
  }, []);

  if (!mounted) return <div className="ob-root" />;

  return (
    <>
      <style>{ONBOARDING_CSS}</style>
      <div className={`ob-root ${!fadeIn ? "faded" : ""}`}>
        
        {/* WELCOME */}
        {phase === "welcome" && (
          <div className="ob-view ob-welcome">
            <div className="ob-notch-buffer" />
            <div className="ob-welcome-content">
              <span className="ob-eyebrow au0">Onboarding · NoZapp</span>
              <h1 className="ob-title au1">I tuoi <em>pilastri</em> del gusto</h1>
              <div className="ob-divider au1" />
              <p className="ob-desc au2">Seleziona i film che hanno definito chi sei oggi.<br/>Andremo a costruire la tua piramide semantica.</p>
              <button className="ob-btn-gold au3" onClick={() => pageTransition(() => setPhase("evaluation"))}>Inizia lo switch →</button>
            </div>
          </div>
        )}

        {/* EVALUATION */}
        {phase === "evaluation" && currentFilm && (
          <div className="ob-view ob-eval">
            <div className="ob-notch-buffer" />
            <div className="ob-top-nav">
              <div className="ob-top-row">
                <span className="ob-brand">La <em>Sfera</em> Semantica</span>
                <span className="ob-mono-lbl">Film {filmIndex + 1} di {films.length}</span>
              </div>
              <div className="ob-p-track"><div className="ob-p-fill" style={{ width: `${((filmIndex + 1)/films.length)*100}%` }} /></div>
            </div>

            <div className="ob-eval-stage">
              <div className="ob-headline au0">
                <h2>Questo film <em>ti appartiene?</em></h2>
                <p>Scegli la tua reazione per continuare</p>
              </div>

              <div className={`ob-card-stage ${cardAnim}`}>
                <div className="ob-film-card" style={filmCardStyle(currentFilm)}>
                  <div className="ob-fc-meta">
                    <span className="ob-fc-dir">{currentFilm.director}</span>
                    <h2 className="ob-fc-title">{currentFilm.title}</h2>
                    <span className="ob-fc-year">{currentFilm.year}</span>
                  </div>
                </div>
              </div>

              <div className="ob-eval-actions au2">
                <button className={`ob-act-btn loved ${reactions[currentFilm.id] === 'loved' ? 'active' : ''}`} onClick={() => handleReaction("loved")}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  <span>Lo amo</span>
                </button>
                <div className="ob-eval-row-2">
                  <button className={`ob-act-btn seen ${reactions[currentFilm.id] === 'seen' ? 'active' : ''}`} onClick={() => handleReaction("seen")}>Visto</button>
                  <button className={`ob-act-btn unseen ${reactions[currentFilm.id] === 'unseen' ? 'active' : ''}`} onClick={() => handleReaction("unseen")}>Non visto</button>
                  <button className={`ob-act-btn disliked ${reactions[currentFilm.id] === 'disliked' ? 'active' : ''}`} onClick={() => handleReaction("disliked")}>No</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM / PYRAMID */}
        {phase === "confirm" && (
          <div className="ob-view ob-confirm">
            <div className="ob-notch-buffer" />
            <div className="ob-confirm-header au0">
              <h2 className="ob-title-sm">La tua <em>Piramide</em></h2>
              <p className="ob-p-sub">SELEZIONA DUE FILM PER SCAMBIARLI DI POSTO.</p>
            </div>

            <div className="ob-confirm-content">
              <div className="ob-pyramid-grid au1">
                {pillars.map((p, i) => (
                  <div 
                    key={i} 
                    className={`ob-p-slot spot-${i} ${selectedSwap?.index === i ? 'selected' : ''}`}
                    onClick={() => p ? handleSwap(p, 'pillar', i) : null}
                  >
                    <div className="ob-p-poster" style={p ? filmCardStyle(p) : {}}>
                      {!p && <span className="ob-empty-txt">Scegli</span>}
                      {p && (
                        <div className="ob-p-overlay">
                          <span className="ob-p-title-ov">{p.title}</span>
                        </div>
                      )}
                    </div>
                    <div className="ob-p-rank">N° {i + 1}</div>
                  </div>
                ))}
              </div>

              {galleryFilms.length > 0 && (
                <div className="ob-gallery au2">
                  <h3 className="ob-side-title">Altri amati</h3>
                  <div className="ob-gallery-grid">
                    {galleryFilms.map(f => (
                      <div 
                        key={f.id} 
                        className={`ob-gal-card ${selectedSwap?.film.id === f.id ? 'selected' : ''}`}
                        onClick={() => handleSwap(f, 'gallery')}
                      >
                        <div className="ob-gal-poster" style={filmCardStyle(f)}></div>
                        <span className="ob-gal-name">{f.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="ob-bot-action au2">
              <button className="ob-btn-ink" onClick={() => pageTransition(() => setPhase("streaming"))}>Conferma Ordine →</button>
            </div>
          </div>
        )}

        {/* STREAMING */}
        {phase === "streaming" && (
          <div className="ob-view ob-form">
            <div className="ob-notch-buffer" />
            <div className="ob-form-header au0">
              <h2 className="ob-title-sm">Dove <em>vedi?</em></h2>
              <p className="ob-p-sub">Useremo questo per mostrarti dove vedere i film suggeriti.</p>
            </div>
            <div className="ob-form-grid au1">
              {STREAMING_PLATFORMS.map(p => (
                <button 
                  key={p.id} 
                  className={`ob-chip ${subscriptions.includes(p.id) ? 'active' : ''}`}
                  onClick={() => setSubscriptions(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div className="ob-bot-action au2">
              <button className="ob-btn-gold" onClick={() => pageTransition(() => setPhase("demographics"))}>Prossimo →</button>
            </div>
          </div>
        )}

        {/* DEMOGRAPHICS */}
        {phase === "demographics" && (
          <div className="ob-view ob-form">
            <div className="ob-notch-buffer" />
            <div className="ob-form-header au0">
              <h2 className="ob-title-sm">Un ultimo <em>tocco</em></h2>
              <p className="ob-p-sub">Conoscerti meglio ci aiuta a calibrare la Sfera.</p>
            </div>
            <div className="ob-input-stack au1">
              <div className="ob-field">
                <label>Data di nascita</label>
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
              </div>
              <div className="ob-field">
                <label>Genere</label>
                <select value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="Non specificato">Non specificato</option>
                  <option value="Uomo">Uomo</option>
                  <option value="Donna">Donna</option>
                  <option value="Altro">Altro / Non Binario</option>
                </select>
              </div>
            </div>
            <div className="ob-bot-action au2">
              <button className="ob-btn-gold" onClick={handleFinalSave}>Completa registrazione →</button>
            </div>
          </div>
        )}

        {/* DONE */}
        {phase === "done" && (
          <div className="ob-view ob-welcome">
            <div className="ob-notch-buffer" />
            <div className="ob-welcome-content">
              <h1 className="ob-title au0">Sei <em>dentro</em></h1>
              <div className="ob-divider au0" />
              <p className="ob-desc au1">La tua Sfera personale sta nascendo ora.<br/>Pronto a immergerti nel Cinema Semantico?</p>
              <a href="/sphere" className="ob-btn-gold au2">Entra nella Sfera →</a>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

const ONBOARDING_CSS = `
  .ob-root {
    --ob-gold: #B8895A;
    --ob-ink: #1A1614;
    --ob-ink-light: #4A4440;
    --ob-ink-faint: #9A9490;
    --ob-cream: #F2EDE3;
    --ob-cream-dark: #E4DBCC;
    --ob-serif: var(--font-serif);
    --ob-mono: var(--font-mono);
    
    position: fixed; inset: 0;
    background: var(--ob-cream);
    color: var(--ob-ink);
    font-family: var(--ob-serif);
    overflow: hidden;
    transition: opacity 0.3s ease;
    z-index: 1000;
  }
  
  .ob-root::after {
    content: ''; position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.6;
  }

  .ob-root.faded { opacity: 0; }
  
  .ob-view {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    width: 100%; height: 100dvh;
    padding: 0 clamp(20px, 5vw, 60px);
    z-index: 1;
  }
  
  .ob-notch-buffer { 
    height: max(20px, env(safe-area-inset-top)); 
    flex-shrink: 0;
  }
  
  .ob-welcome { justify-content: center; align-items: center; text-align: center; }
  .ob-welcome-content { max-width: 520px; }
  
  .ob-eyebrow { 
    display: block; font-family: var(--ob-mono); font-size: 10px; 
    text-transform: uppercase; letter-spacing: 0.25em; color: var(--ob-gold);
    margin-bottom: 24px;
  }
  .ob-title { font-size: clamp(42px, 9vw, 84px); font-weight: 300; line-height: 1.05; margin: 16px 0; }
  .ob-title-sm { font-size: clamp(32px, 6vw, 48px); font-weight: 300; line-height: 1.1; margin: 12px 0 8px; }
  .ob-title-sm em, .ob-title em { font-style: italic; color: var(--ob-gold); }
  
  .ob-divider { width: 32px; height: 1px; background: var(--ob-gold); margin: 32px auto; }
  
  .ob-desc { font-size: clamp(16px, 2.2vw, 20px); font-weight: 300; color: var(--ob-ink-light); line-height: 1.65; margin-bottom: 48px; }
  .ob-p-sub { font-family: var(--ob-mono); font-size: clamp(8px, 1.2vw, 10px); text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.5; margin-bottom: 24px; }
  
  .ob-btn-gold { 
    background: var(--ob-ink); color: var(--ob-cream); border: none; padding: 18px 48px; border-radius: 4px;
    font-family: var(--ob-mono); text-transform: uppercase; letter-spacing: 0.15em; font-size: 11px; cursor: pointer;
    transition: all 0.22s;
  }
  .ob-btn-gold:hover { background: var(--ob-gold); transform: translateY(-2px); }
  .ob-btn-ink { 
    background: var(--ob-ink); color: var(--ob-cream); border: none; padding: 16px 40px; border-radius: 4px;
    font-family: var(--ob-mono); text-transform: uppercase; letter-spacing: 0.15em; font-size: 11px; cursor: pointer;
    transition: all 0.2s;
  }
  .ob-btn-ink:hover { background: var(--ob-gold); }

  /* Top Bar */
  .ob-top-nav { padding: 20px 0; position: relative; z-index: 10; }
  .ob-top-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
  .ob-brand { font-size: 16px; font-weight: 300; }
  .ob-brand em { font-style: italic; color: var(--ob-gold); }
  .ob-mono-lbl { font-family: var(--ob-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.4; }
  .ob-p-track { height: 2px; width: 100%; background: var(--ob-cream-dark); }
  .ob-p-fill { height: 100%; background: var(--ob-gold); transition: width 0.4s ease; }

  /* Evaluation */
  .ob-eval-stage { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 40px; }
  .ob-headline { text-align: center; margin-bottom: clamp(20px, 4vh, 40px); }
  .ob-headline h2 { font-size: clamp(22px, 4vw, 36px); font-weight: 300; margin-bottom: 8px; }
  .ob-headline h2 em { font-style: italic; color: var(--ob-gold); }
  .ob-headline p { font-family: var(--ob-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--ob-ink-faint); }
  
  .ob-card-stage { 
    width: 100%; display: flex; justify-content: center; 
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .ob-film-card {
    width: clamp(240px, 45vh, 340px); aspect-ratio: 2/3;
    border-radius: 4px; overflow: hidden; position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1);
    display: flex; align-items: flex-end; padding: 24px;
    background-color: var(--ob-ink);
  }
  .ob-fc-meta { color: #fff; position: relative; z-index: 2; width: 100%; }
  .ob-fc-dir { font-family: var(--ob-mono); font-size: 9px; text-transform: uppercase; opacity: 0.6; letter-spacing: 0.1em; }
  .ob-fc-title { font-size: clamp(20px, 3.5vh, 28px); line-height: 1.15; margin: 4px 0 6px; font-weight: 400; }
  .ob-fc-year { opacity: 0.4; font-family: var(--ob-mono); font-size: 11px; }

  .ob-eval-actions { padding-top: 32px; display: flex; flex-direction: column; gap: 10px; align-items: center; width: 100%; max-width: 360px; }
  .ob-eval-row-2 { display: flex; gap: 8px; width: 100%; }
  .ob-act-btn { 
    flex: 1; background: transparent; border: 1.5px solid var(--ob-cream-dark); padding: 14px; border-radius: 4px;
    font-family: var(--ob-mono); font-size: clamp(8px, 1.2vw, 10px); text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer;
    transition: all 0.18s; color: var(--ob-ink-light);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .ob-act-btn.loved { 
    width: 100%; background: var(--ob-gold); border-color: var(--ob-gold); 
    color: #fff; font-size: 12px; padding: 18px; margin-bottom: 4px;
  }
  .ob-act-btn:hover { border-color: var(--ob-gold); color: var(--ob-gold); }
  .ob-act-btn.loved:hover { background: var(--ob-ink); border-color: var(--ob-ink); color: #fff; }
  .ob-act-btn.active { background: var(--ob-ink); color: #fff; border-color: var(--ob-ink); }
  .ob-act-btn.loved.active { background: var(--ob-ink); color: #fff; border-color: var(--ob-ink); }

  /* Confirm / Pyramid */
  .ob-confirm-header { padding: 32px 0 20px; text-align: center; }
  .ob-confirm-content { display: flex; gap: 40px; flex: 1; overflow: hidden; padding-bottom: 100px; }
  
  .ob-pyramid-grid {
    flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); 
    gap: 16px 12px; align-content: flex-start;
  }
  .ob-p-slot { 
    position: relative; cursor: pointer; transition: transform 0.22s ease;
    display: flex; flex-direction: column; gap: 8px;
  }
  .ob-p-slot.selected { transform: scale(1.05); }
  .ob-p-slot.selected .ob-p-poster { border: 2.5px solid var(--ob-gold); box-shadow: 0 0 20px rgba(184,137,90,0.3); }
  
  .ob-p-rank { font-family: var(--ob-mono); font-size: clamp(7px, 1vw, 9px); color: var(--ob-gold); text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; gap: 6px; }
  .ob-p-rank::after { content: ''; flex: 1; height: 1px; background: var(--ob-gold); opacity: 0.2; }
  
  .ob-p-poster { 
    width: 100%; aspect-ratio: 2/3; border-radius: 3px; background: var(--ob-cream-dark);
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: all 0.22s; border: 1.5px solid transparent;
  }
  .ob-p-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 10px; }
  .ob-p-title-ov { color: #fff; font-size: clamp(8px, 1.2vw, 11px); line-height: 1.3; font-weight: 300; }
  .ob-empty-txt { font-family: var(--ob-mono); font-size: 9px; text-transform: uppercase; opacity: 0.3; }

  /* Mobile Pyramid (2x3 Grid style) */
  .spot-0 { grid-column: span 3; }
  .spot-1 { grid-column: span 3; }
  .spot-2 { grid-column: span 2; }
  .spot-3 { grid-column: span 2; }
  .spot-4 { grid-column: span 2; }
  .spot-5 { grid-column: span 3; }

  @media (min-width: 640px) {
    .ob-pyramid-grid { grid-template-columns: repeat(3, 1fr); padding-bottom: 20px; }
    .spot-0 { grid-column: 2 / 3; }
    .spot-1 { grid-column: 1 / 2; }
    .spot-2 { grid-column: 2 / 3; }
    .spot-3 { grid-column: 1 / 2; }
    .spot-4 { grid-column: 2 / 3; }
    .spot-5 { grid-column: 3 / 4; }
  }

  .ob-gallery { width: clamp(160px, 20vw, 220px); border-left: 1px solid var(--ob-cream-dark); padding-left: 24px; display: flex; flex-direction: column; }
  .ob-side-title { font-family: var(--ob-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; opacity: 0.5; }
  .ob-gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; overflow-y: auto; flex: 1; padding-bottom: 120px; }
  .ob-gal-card { cursor: pointer; transition: transform 0.2s; }
  .ob-gal-card.selected .ob-gal-poster { border: 2px solid var(--ob-gold); }
  .ob-gal-poster { aspect-ratio: 2/3; border-radius: 2px; background: var(--ob-cream-dark); border: 1.5px solid transparent; transition: all 0.2s; }
  .ob-gal-name { font-size: 9px; display: block; margin-top: 4px; height: 24px; overflow: hidden; opacity: 0.7; font-family: var(--ob-mono); text-transform: uppercase; }

  .ob-bot-action { 
    position: fixed; bottom: 0; left: 0; right: 0; 
    background: linear-gradient(to top, var(--ob-cream) 80%, transparent); 
    padding: 30px clamp(20px, 5vw, 60px) clamp(30px, 6vh, 40px); 
    display: flex; justify-content: flex-end; align-items: center; gap: 20px;
    z-index: 50;
  }

  /* Forms */
  .ob-form-header { padding: 40px 0 20px; text-align: center; }
  .ob-form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; padding-bottom: 120px; }
  .ob-chip { 
    background: transparent; border: 1.5px solid var(--ob-cream-dark); padding: 14px; border-radius: 4px;
    font-family: var(--ob-mono); font-size: 10px; cursor: pointer; text-align: center; color: var(--ob-ink-light);
    transition: all 0.2s;
  }
  .ob-chip:hover { border-color: var(--ob-gold); color: var(--ob-gold); }
  .ob-chip.active { background: var(--ob-ink); color: #fff; border-color: var(--ob-ink); }

  .ob-input-stack { margin: 32px auto; display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 440px; }
  .ob-field label { display: block; font-family: var(--ob-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 10px; opacity: 0.6; }
  .ob-field input, .ob-field select { 
    width: 100%; padding: 16px; border: 1.5px solid var(--ob-cream-dark); border-radius: 4px; background: transparent;
    font-family: var(--ob-serif); font-size: 18px; color: var(--ob-ink); transition: border-color 0.2s;
  }
  .ob-field input:focus, .ob-field select:focus { border-color: var(--ob-gold); outline: none; }

  /* Animations */
  @keyframes au { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
  .au0 { animation: au 0.6s 0.1s ease both; }
  .au1 { animation: au 0.6s 0.2s ease both; }
  .au2 { animation: au 0.6s 0.3s ease both; }
  .au3 { animation: au 0.6s 0.4s ease both; }
  
  .exit-loved { transform: translateX(100px) rotate(8deg); opacity: 0; }
  .exit-disliked { transform: translateX(-100px) rotate(-8deg); opacity: 0; }
  .exit-seen { transform: translateY(-40px); opacity: 0; }
  .exit-unseen { transform: translateY(40px); opacity: 0; }
  .enter { transform: translateY(12px); opacity: 0; transition: none; }

  @media (max-width: 640px) {
    .ob-confirm-content { flex-direction: column; overflow-y: auto; padding-bottom: 140px; }
    .ob-gallery { width: 100%; border-left: none; border-top: 1px solid var(--ob-cream-dark); padding: 24px 0; }
    .ob-gallery-grid { grid-template-columns: repeat(4, 1fr); min-height: 200px; padding-bottom: 20px; }
    .ob-bot-action { padding: 20px 20px clamp(30px, 5vh, 40px); background: var(--ob-cream); }
    .ob-form-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;
