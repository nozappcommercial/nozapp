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
      // First selection
      setSelectedSwap({ film: clickedFilm, source, index: pillarIdx });
      return;
    }

    if (selectedSwap.film.id === clickedFilm.id) {
      // Unselect
      setSelectedSwap(null);
      return;
    }

    // Execute Swap
    const nextPillars = [...pillars];
    
    if (selectedSwap.source === 'pillar' && source === 'pillar') {
      // Swap within pillars
      const temp = nextPillars[selectedSwap.index!];
      nextPillars[selectedSwap.index!] = nextPillars[pillarIdx!];
      nextPillars[pillarIdx!] = temp;
    } else if (selectedSwap.source === 'gallery' && source === 'pillar') {
      // Swap gallery item with pillar spot
      nextPillars[pillarIdx!] = selectedSwap.film;
    } else if (selectedSwap.source === 'pillar' && source === 'gallery') {
      // Swap pillar spot with gallery item
      nextPillars[selectedSwap.index!] = clickedFilm;
    }
    
    setPillars(nextPillars);
    setSelectedSwap(null);
  };

  // --- Final Save ---
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

  // --- Visual Helpers ---
  const filmCardStyle = useCallback((film: OnboardingFilm) => {
    if (film.poster_url) {
      return { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url(${film.poster_url})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    return { background: `linear-gradient(135deg, ${film.color_primary} 0%, ${film.color_accent} 100%)` };
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
              <span className="ob-eyebrow">Onboarding · NoZapp</span>
              <h1 className="ob-title">I pilastri del tuo <em>gusto</em></h1>
              <p className="ob-desc">Seleziona i film che hanno definito chi sei oggi. Andremo a costruire la tua piramide semantica.</p>
              <button className="ob-btn-gold" onClick={() => pageTransition(() => setPhase("evaluation"))}>Inizia →</button>
            </div>
          </div>
        )}

        {/* EVALUATION */}
        {phase === "evaluation" && currentFilm && (
          <div className="ob-view ob-eval">
            <div className="ob-notch-buffer" />
            <div className="ob-top-nav">
              <span className="ob-mono-lbl">Film {filmIndex + 1} di {films.length}</span>
              <div className="ob-p-track"><div className="ob-p-fill" style={{ width: `${(filmIndex/films.length)*100}%` }} /></div>
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

            <div className="ob-eval-actions">
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
        )}

        {/* CONFIRM / PYRAMID */}
        {phase === "confirm" && (
          <div className="ob-view ob-confirm">
            <div className="ob-notch-buffer" />
            <div className="ob-confirm-header">
              <h2 className="ob-title-sm">La tua <em>Piramide</em></h2>
              <p className="ob-p-sub">Seleziona due film per scambiarli di posto.</p>
            </div>

            <div className="ob-confirm-split">
              <div className="ob-pyramid-grid">
                {pillars.map((p, i) => (
                  <div 
                    key={i} 
                    className={`ob-p-slot spot-${i} ${selectedSwap?.index === i ? 'selected' : ''}`}
                    onClick={() => p ? handleSwap(p, 'pillar', i) : null}
                  >
                    <div className="ob-p-rank">N° {i + 1}</div>
                    <div className="ob-p-poster" style={p ? filmCardStyle(p) : {}}>
                      {!p && <span className="ob-empty-txt">Scegli</span>}
                      {p && <span className="ob-p-title-ov">{p.title}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {galleryFilms.length > 0 && (
                <div className="ob-gallery">
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

            <div className="ob-bot-action">
              <button className="ob-btn-ink" onClick={() => pageTransition(() => setPhase("streaming"))}>Conferma Ordine →</button>
            </div>
          </div>
        )}

        {/* STREAMING */}
        {phase === "streaming" && (
          <div className="ob-view ob-form">
            <div className="ob-notch-buffer" />
            <h2 className="ob-title-sm">Dove <em>vedi?</em></h2>
            <p className="ob-p-sub">Useremo questo per mostrarti dove vedere i film suggeriti.</p>
            <div className="ob-form-grid">
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
            <div className="ob-bot-action">
              <button className="ob-btn-ink" onClick={() => pageTransition(() => setPhase("demographics"))}>Prossimo →</button>
            </div>
          </div>
        )}

        {/* DEMOGRAPHICS */}
        {phase === "demographics" && (
          <div className="ob-view ob-form">
            <div className="ob-notch-buffer" />
            <h2 className="ob-title-sm">Un ultimo <em>tocco</em></h2>
            <div className="ob-input-stack">
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
            <div className="ob-bot-action">
              <button className="ob-btn-gold" onClick={handleFinalSave}>Completa registrazione →</button>
            </div>
          </div>
        )}

        {/* DONE */}
        {phase === "done" && (
          <div className="ob-view ob-welcome">
            <div className="ob-notch-buffer" />
            <div className="ob-welcome-content">
              <h1 className="ob-title">Sei <em>dentro</em></h1>
              <p className="ob-desc">La tua Sfera personale sta nascendo ora. Pronto a immergerti nel Cinema Semantico?</p>
              <a href="/sphere" className="ob-btn-gold">Entra nella Sfera →</a>
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
    --ob-cream: #F2EDE3;
    --ob-cream-dark: #E6DFD1;
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
  .ob-root.faded { opacity: 0; }
  
  .ob-view {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    width: 100%; height: 100dvh;
    padding: 0 clamp(20px, 5vw, 60px);
  }
  
  .ob-notch-buffer { 
    height: max(20px, env(safe-area-inset-top)); 
    flex-shrink: 0;
  }
  
  .ob-welcome { justify-content: center; align-items: center; text-align: center; }
  .ob-welcome-content { max-width: 460px; animation: ob-pop 0.6s ease both; }
  
  .ob-eyebrow { font-family: var(--ob-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.6; }
  .ob-title { font-size: clamp(38px, 8vw, 72px); font-weight: 300; line-height: 1.1; margin: 16px 0; }
  .ob-title-sm { font-size: clamp(28px, 5vw, 42px); font-weight: 300; line-height: 1.2; margin: 12px 0 4px; }
  .ob-title em { font-style: italic; color: var(--ob-gold); }
  .ob-desc { font-size: clamp(16px, 2vw, 20px); opacity: 0.8; line-height: 1.6; margin-bottom: 40px; }
  .ob-p-sub { font-family: var(--ob-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.5; margin-bottom: 24px; }
  
  .ob-btn-gold { 
    background: var(--ob-gold); color: #fff; border: none; padding: 16px 48px; border-radius: 4px;
    font-family: var(--ob-mono); text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; cursor: pointer;
    transition: transform 0.2s, background 0.2s;
  }
  .ob-btn-gold:hover { background: var(--ob-ink); transform: translateY(-2px); }
  .ob-btn-ink { 
    background: var(--ob-ink); color: #fff; border: none; padding: 16px 40px; border-radius: 4px;
    font-family: var(--ob-mono); text-transform: uppercase; letter-spacing: 0.1em; font-size: 11px; cursor: pointer;
  }

  /* Evaluation */
  .ob-eval { padding-top: 20px; }
  .ob-top-nav { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .ob-mono-lbl { font-family: var(--ob-mono); font-size: 10px; text-transform: uppercase; opacity: 0.4; }
  .ob-p-track { height: 2px; width: 100%; background: var(--ob-cream-dark); }
  .ob-p-fill { height: 100%; background: var(--ob-gold); transition: width 0.4s ease; }
  
  .ob-card-stage { 
    flex: 1; display: flex; align-items: center; justify-content: center; 
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .ob-film-card {
    width: clamp(260px, 70vw, 360px); aspect-ratio: 2/3;
    border-radius: 12px; overflow: hidden; position: relative;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
    display: flex; align-items: flex-end; padding: 32px;
  }
  .ob-fc-meta { color: #fff; }
  .ob-fc-dir { font-family: var(--ob-mono); font-size: 10px; text-transform: uppercase; opacity: 0.7; }
  .ob-fc-title { font-size: 28px; line-height: 1.1; margin: 4px 0 8px; font-weight: 300; }
  .ob-fc-year { opacity: 0.4; font-size: 13px; }

  .ob-eval-actions { padding: 32px 0; display: flex; flex-direction: column; gap: 12px; align-items: center; }
  .ob-eval-row-2 { display: flex; gap: 8px; width: 100%; max-width: 360px; }
  .ob-act-btn { 
    flex: 1; background: transparent; border: 1px solid var(--ob-cream-dark); padding: 14px; border-radius: 6px;
    font-family: var(--ob-mono); font-size: 10px; text-transform: uppercase; cursor: pointer;
    transition: all 0.2s; color: var(--ob-ink);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .ob-act-btn.loved { 
    width: 100%; max-width: 360px; background: rgba(184,137,90,0.08); border-color: var(--ob-gold); 
    color: var(--ob-gold); font-size: 12px; padding: 18px;
  }
  .ob-act-btn.active { background: var(--ob-ink); color: #fff; border-color: var(--ob-ink); }
  .ob-act-btn.loved.active { background: var(--ob-gold); color: #fff; border-color: var(--ob-gold); }

  /* Confirm / Pyramid */
  .ob-confirm { padding-top: 20px; }
  .ob-confirm-split { display: flex; gap: 40px; flex: 1; overflow: hidden; padding-bottom: 100px; }
  
  .ob-pyramid-grid {
    flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(2, auto);
    gap: 12px; align-content: center;
  }
  .ob-p-slot { 
    position: relative; cursor: pointer; transition: transform 0.2s;
  }
  .ob-p-slot.selected { outline: 2px solid var(--ob-gold); outline-offset: 4px; transform: scale(1.05); }
  .ob-p-rank { position: absolute; top: -14px; left: 0; font-family: var(--ob-mono); font-size: 8px; color: var(--ob-gold); text-transform: uppercase; }
  .ob-p-poster { 
    width: 100%; aspect-ratio: 2/3; border-radius: 6px; background: var(--ob-cream-dark);
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .ob-p-title-ov { position: absolute; bottom: 8px; left: 8px; right: 8px; color: #fff; font-size: 9px; line-height:1.2; font-weight: 300; }
  .ob-empty-txt { font-family: var(--ob-mono); font-size: 9px; text-transform: uppercase; opacity: 0.3; }

  /* Mobile Pyramid (2x3 Grid) */
  .spot-0 { grid-column: span 3; }
  .spot-1 { grid-column: span 3; }
  .spot-2 { grid-column: span 2; }
  .spot-3 { grid-column: span 2; }
  .spot-4 { grid-column: span 2; }
  .spot-5 { grid-column: span 3; } /* Adjusted for mobile grid look */

  @media (min-width: 640px) {
    .ob-pyramid-grid { grid-template-columns: repeat(3, 1fr); }
    .spot-0 { grid-column: 2 / 3; }
    .spot-1 { grid-column: 1 / 2; }
    .spot-2 { grid-column: 2 / 3; }
    .spot-3 { grid-column: 1 / 2; }
    .spot-4 { grid-column: 2 / 3; }
    .spot-5 { grid-column: 3 / 4; }
  }

  .ob-gallery { width: 200px; border-left: 1px solid var(--ob-cream-dark); padding-left: 24px; display: flex; flex-direction: column; }
  .ob-side-title { font-family: var(--ob-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; opacity: 0.5; }
  .ob-gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; overflow-y: auto; flex: 1; padding-bottom: 24px; }
  .ob-gal-card { cursor: pointer; transition: transform 0.2s; }
  .ob-gal-card.selected { outline: 2px solid var(--ob-gold); outline-offset: 1px; }
  .ob-gal-poster { aspect-ratio: 2/3; border-radius: 4px; background: var(--ob-cream-dark); }
  .ob-gal-name { font-size: 9px; display: block; margin-top: 4px; height: 24px; overflow: hidden; opacity: 0.7; }

  .ob-bot-action { position: fixed; bottom: 0; left: 0; right: 0; background: var(--ob-cream); padding: 20px 60px 40px; border-top: 1px solid var(--ob-cream-dark); text-align: right; }

  /* Forms */
  .ob-form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 24px; }
  .ob-chip { 
    background: transparent; border: 1px solid var(--ob-cream-dark); padding: 12px; border-radius: 4px;
    font-family: var(--ob-mono); font-size: 10px; cursor: pointer; text-align: center;
  }
  .ob-chip.active { background: var(--ob-ink); color: #fff; border-color: var(--ob-ink); }

  .ob-input-stack { margin-top: 32px; display: flex; flex-direction: column; gap: 20px; max-width: 400px; }
  .ob-field label { display: block; font-family: var(--ob-mono); font-size: 10px; text-transform: uppercase; margin-bottom: 8px; opacity: 0.6; }
  .ob-field input, .ob-field select { 
    width: 100%; padding: 14px; border: 1px solid var(--ob-cream-dark); border-radius: 4px; background: transparent;
    font-family: var(--ob-serif); font-size: 16px;
  }

  /* Animations */
  @keyframes ob-pop { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
  
  .exit-loved { transform: translateX(100px) rotate(10deg); opacity: 0; }
  .exit-disliked { transform: translateX(-100px) rotate(-10deg); opacity: 0; }
  .exit-seen { transform: translateY(-40px); opacity: 0; }
  .exit-unseen { transform: translateY(40px); opacity: 0; }
  .enter { transform: translateY(20px); opacity: 0; transition: none; }

  @media (max-width: 640px) {
    .ob-confirm-split { flex-direction: column; overflow-y: auto; }
    .ob-gallery { width: 100%; border-left: none; border-top: 1px solid var(--ob-cream-dark); padding: 24px 0; }
    .ob-gallery-grid { grid-template-columns: repeat(4, 1fr); min-height: 200px; }
    .ob-bot-action { padding: 20px 24px 34px; }
  }
`;
