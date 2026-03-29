"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { OnboardingFilm } from "@/app/onboarding/page";

/* ─── Constants ─────────────────────────────────────────────────── */
const MAX_PILLARS = 6;

type Reaction = "loved" | "disliked" | "seen" | "unseen";
type Phase = "welcome" | "step" | "confirm" | "streaming" | "demographics" | "done";

const STREAMING_PLATFORMS = [
  { id: "Netflix", name: "Netflix" },
  { id: "Prime Video", name: "Prime Video" },
  { id: "Disney+", name: "Disney+" },
  { id: "Apple TV", name: "Apple TV" },
  { id: "Now", name: "Now" },
  { id: "Paramount+", name: "Paramount+" },
  { id: "HBO Max", name: "HBO Max" },
  { id: "Mubi", name: "Mubi" },
  { id: "Crunchyroll", name: "Crunchyroll" },
  { id: "Discovery+", name: "Discovery+" },
  { id: "Infinity", name: "Infinity" },
  { id: "RaiPlay", name: "RaiPlay" }
];

interface OnboardingFlowProps {
  films: OnboardingFilm[];
}


export default function OnboardingFlow({ films }: OnboardingFlowProps) {
  const isMobile = useIsMobile(640);

  // Split films into 3 groups based on onboarding_group
  const STEPS = [
    films.filter(f => f.onboarding_group === 1),
    films.filter(f => f.onboarding_group === 2),
    films.filter(f => f.onboarding_group === 3),
  ];

  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentStep, setCurrentStep] = useState(0);
  const [filmIndex, setFilmIndex] = useState(0);
  const [reactions, setReactions] = useState<Record<number, Reaction>>({});
  const [pillars, setPillars] = useState<OnboardingFilm[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("Italia");
  const [gender, setGender] = useState("Non specificato");
  const [cardAnim, setCardAnim] = useState("idle");
  const [stepDone, setStepDone] = useState(false);
  const [replacingPillar, setReplacingPillar] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [dragItem, setDragItem] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [isSideboardOpen, setIsSideboardOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const lovedFilms = films.filter(f => reactions[f.id] === "loved");
  const stepFilms = STEPS[currentStep] || [];
  const currentFilm = stepFilms[filmIndex];
  const isLastStep = currentStep === STEPS.length - 1;
  const allReacted = stepFilms.every(f => reactions[f.id]);

  /* ─── Transition helpers ──────────────────────────────────────── */
  const pageTransition = useCallback((fn: () => void) => {
    setFadeIn(false);
    setTimeout(() => { fn(); setFadeIn(true); }, 280);
  }, []);

  function animateCard(type: string, afterFn: () => void) {
    setCardAnim(`exit-${type}`);
    setTimeout(() => {
      afterFn();
      setCardAnim("enter");
      setTimeout(() => setCardAnim("idle"), 320);
    }, 260);
  }

  /* ─── Reaction handler ────────────────────────────────────────── */
  function handleReaction(key: Reaction) {
    if (stepDone) return;
    const film = currentFilm;
    animateCard(key, () => {
      const updated = { ...reactions, [film.id]: key };
      setReactions(updated);
      const isLastFilm = filmIndex === stepFilms.length - 1;
      if (isLastFilm) {
        setTimeout(() => setStepDone(true), 80);
      } else {
        setFilmIndex(i => i + 1);
      }
    });
  }

  /* ─── Navigation ──────────────────────────────────────────────── */
  function navigateTo(idx: number) {
    if (idx < 0 || idx >= stepFilms.length) return;
    if (stepDone) {
      setStepDone(false);
      setFilmIndex(idx);
      setCardAnim("enter");
      setTimeout(() => setCardAnim("idle"), 300);
      return;
    }
    const dir = idx > filmIndex ? "nav-fwd" : "nav-bck";
    setCardAnim(`exit-${dir}`);
    setTimeout(() => {
      setFilmIndex(idx);
      setCardAnim("enter");
      setTimeout(() => setCardAnim("idle"), 300);
    }, 220);
  }

  function handleNextStep() {
    if (!isLastStep) {
      pageTransition(() => {
        setCurrentStep(s => s + 1);
        setFilmIndex(0);
        setStepDone(false);
        setCardAnim("enter");
        setTimeout(() => setCardAnim("idle"), 350);
      });
    } else {
      const selected = lovedFilms.slice(0, MAX_PILLARS);
      setPillars(selected);
      pageTransition(() => setPhase("confirm"));
    }
  }

  /* ─── Touch swipe ─────────────────────────────────────────────── */
  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 48) return;
    handleReaction(dx > 0 ? "loved" : "disliked");
  }

  /* ─── Drag & Drop ─────────────────────────────────────────────── */
  function onDragStart(idx: number) { setDragItem(idx); }
  function onDragEnter(idx: number) { setDragOver(idx); }
  function onDragEnd() {
    // Clear regardless of success
    setTimeout(() => {
      setDragItem(null); setDragOver(null);
      delete (window as any)._draggedSidebarFilm;
    }, 50);
  }

  function onDrop(idx: number) {
    console.log("Drop triggered on index:", idx, "from item:", dragItem);
    if (dragItem !== null) {
      if (dragItem === -1) {
        const film = (window as any)._draggedSidebarFilm;
        if (film) {
          const next = [...pillars];
          next[idx] = film;
          setPillars(next);
        }
      } else if (dragItem !== idx) {
        const next = [...pillars];
        const [r] = next.splice(dragItem, 1);
        next.splice(idx, 0, r);
        setPillars(next);
      }
    }
  }

  function handleReplace(idx: number, film: OnboardingFilm) {
    const next = [...pillars]; next[idx] = film; setPillars(next);
    setReplacingPillar(null);
  }

  const replacementCandidates = lovedFilms.filter(f => !pillars.find(p => p.id === f.id));

  /* ─── Save & Confirm ──────────────────────────────────────────── */
  async function handleConfirm() {
    setSaving(true);
    try {
      const result = {
        pillars: pillars.map((p, i) => ({
          filmId: p.id,
          title: p.title,
          rank: i + 1,
        })),
        reactions, // Use the raw object {id: reaction}
        streaming_subscriptions: subscriptions,
        birth_date: birthDate,
        country: country,
        gender: gender,
        timestamp: new Date().toISOString(),
      };

      // Save via API route
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Failed to save onboarding results:", res.status, errData);
        alert(`Errore di salvataggio [${res.status}]: ${errData.error || res.statusText}`);
        setSaving(false);
        return;
      }

      console.log("Onboarding saved successfully, status:", res.status);

      setSaving(false);
      pageTransition(() => setPhase("done"));
    } catch (err) {
      console.error("Error saving onboarding:", err);
      alert("Errore di rete durante il salvataggio.");
      setSaving(false);
    }
  }

  /* ─── Card animation style ────────────────────────────────────── */
  const cardStyle = (() => {
    const t = "opacity 0.22s ease, transform 0.22s ease";
    if (cardAnim === "exit-loved") return { opacity: 0, transform: "translateX(70px) rotate(8deg)", transition: t };
    if (cardAnim === "exit-disliked") return { opacity: 0, transform: "translateX(-70px) rotate(-8deg)", transition: t };
    if (cardAnim === "exit-seen") return { opacity: 0, transform: "translateY(-40px) scale(0.96)", transition: t };
    if (cardAnim === "exit-unseen") return { opacity: 0, transform: "translateY(-40px) scale(0.96)", transition: t };
    if (cardAnim === "exit-nav-fwd") return { opacity: 0, transform: "translateX(-32px)", transition: t };
    if (cardAnim === "exit-nav-bck") return { opacity: 0, transform: "translateX(32px)", transition: t };
    if (cardAnim === "enter") return { opacity: 0, transform: "translateY(12px)", transition: "none" };
    return { opacity: 1, transform: "none", transition: t };
  })();

  const progressPct = (filmIndex / stepFilms.length) * 100;

  /* ─── Card background: poster or gradient ─────────────────────── */
  function filmCardBg(film: OnboardingFilm): React.CSSProperties {
    if (film.poster_url) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%), url(${film.poster_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {
      background: `linear-gradient(155deg, ${film.color_primary} 0%, ${film.color_accent}60 55%, ${film.color_primary}EE 100%)`,
    };
  }

  function filmGradient(film: OnboardingFilm): React.CSSProperties {
    if (film.poster_url) {
      return {
        backgroundImage: `url(${film.poster_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {
      background: `linear-gradient(155deg, ${film.color_primary} 0%, ${film.color_accent}66 70%, ${film.color_primary} 100%)`,
    };
  }

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="ob-root ob-faded"></div>;
  }

  return (
    <>
      <style>{ONBOARDING_CSS}</style>

      <div className={`ob-root${!fadeIn ? " ob-faded" : ""}`}>

        {/* ═══ WELCOME ═══ */}
        {phase === "welcome" && (
          <div className="ob-welcome">
            <div className="ob-eyebrow">Semantic Sphere · Onboarding</div>
            <h1 className="ob-w-title">I tuoi<br /><em>pilastri</em><br />del gusto</h1>
            <div className="ob-divider" />
            <p className="ob-w-sub">Ogni film che ami è una porta.<br />Mostraci le tue porte.</p>
            <p className="ob-w-desc">
              Ti mostreremo 15 film in tre gruppi.<br />
              Dicci cosa ami, cosa non fa per te,<br />
              cosa non hai ancora visto.
            </p>
            <button className="ob-btn-p" onClick={() => pageTransition(() => setPhase("step"))}>
              Inizia →
            </button>
          </div>
        )}

        {/* ═══ STEP ═══ */}
        {phase === "step" && (
          <div className="ob-step-shell">
            {/* topbar */}
            <div className="ob-topbar">
              <div className="ob-brand">La <em>Sfera</em> Semantica</div>
              <div className="ob-step-meta">
                <div className="ob-step-dots">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`ob-sdot ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`} />
                  ))}
                </div>
                <div className="ob-step-lbl">Gruppo {currentStep + 1}/{STEPS.length}</div>
              </div>
            </div>

            {/* progress bar */}
            <div className="ob-pbar">
              <div className="ob-pbar-fill" style={{ width: stepDone ? "100%" : `${progressPct}%` }} />
            </div>

            {/* card stage */}
            <div className="ob-stage">
              <div className="ob-stage-headline">
                <h2>
                  {stepDone
                    ? <><em>Gruppo {currentStep + 1}</em> completato</>
                    : currentStep === 0 ? <>Questo film <em>ti appartiene?</em></>
                      : currentStep === 1 ? <>Ti <em>riconosce?</em></>
                        : <><em>Sii onesto.</em></>
                  }
                </h2>
                <p>
                  {stepDone
                    ? `${stepFilms.filter(f => reactions[f.id] === "loved").length} amati · clicca un punto per tornare`
                    : `${filmIndex + 1} di ${stepFilms.length} · gruppo ${currentStep + 1}`
                  }
                </p>
              </div>

              <div className="ob-card-wrap">
                {/* completion card */}
                {stepDone ? (
                  <div className="ob-done-card-sizer">
                    <div className="ob-done-card">
                      <div className="ob-done-card-check">✓</div>
                      <div className="ob-done-card-label">
                        tutti i film<br />valutati
                      </div>
                    </div>
                  </div>
                ) : currentFilm ? (
                  <>
                    {/* film card */}
                    <div className="ob-film-card-sizer" style={cardStyle}>
                      <div
                        className="ob-film-card"
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                      >
                        <div className="ob-fc-bg" style={filmCardBg(currentFilm)} />
                        <div className="ob-fc-info">
                          <div className="ob-fc-mood">{currentFilm.mood}</div>
                          <div>
                            <div className="ob-fc-title">{currentFilm.title}</div>
                            <div className="ob-fc-dir">{currentFilm.director} · {currentFilm.year}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* swipe hint mobile */}
                    {isMobile === true && <div className="ob-swipe-hint">swipe per valutare · frecce per navigare</div>}
                  </>
                ) : null}

                {/* nav arrows + dot trail */}
                <div className="ob-nav-arrows">
                  <button
                    className="ob-nav-arrow"
                    disabled={!stepDone && filmIndex === 0}
                    onClick={() => stepDone ? navigateTo(stepFilms.length - 1) : navigateTo(filmIndex - 1)}
                  >←</button>
                  <div className="ob-nav-center">
                    <div className="ob-f-dots">
                      {stepFilms.map((f, i) => {
                        const r = reactions[f.id];
                        const isCur = !stepDone && i === filmIndex;
                        const cls = isCur ? "cur" : r === "loved" ? "loved" : r === "disliked" ? "disliked" : r === "unseen" ? "unseen" : "";
                        return (
                          <div key={f.id} className={`ob-fdot ${cls}`} style={{ cursor: "pointer" }} onClick={() => navigateTo(i)} title={f.title} />
                        );
                      })}
                    </div>
                  </div>
                  <button
                    className="ob-nav-arrow"
                    disabled={!stepDone && filmIndex === stepFilms.length - 1}
                    onClick={() => navigateTo(filmIndex + 1)}
                  >→</button>
                </div>

                {/* reaction buttons */}
                {!stepDone && currentFilm && (
                  <>
                    <div className="ob-rxn-row" key={currentFilm.id}>
                      <button 
                        className={`ob-rxn-btn loved ${reactions[currentFilm.id] === 'loved' ? 'active' : ''}`} 
                        onClick={() => handleReaction("loved")}
                      >
                        <span className="ob-rxn-icon" style={{ color: "var(--ob-gold)" }}>♥</span>
                        <span className="ob-rxn-lbl">L&apos;ho<br />amato</span>
                      </button>
                      <button 
                        className={`ob-rxn-btn disliked ${reactions[currentFilm.id] === 'disliked' ? 'active' : ''}`} 
                        onClick={() => handleReaction("disliked")}
                      >
                        <span className="ob-rxn-icon" style={{ color: "var(--ob-ink-light)" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </span>
                        <span className="ob-rxn-lbl">Non fa<br />per me</span>
                      </button>

                      <div className={`ob-rxn-split ${reactions[currentFilm.id] === 'seen' ? 'active-seen' : reactions[currentFilm.id] === 'unseen' ? 'active-unseen' : ''}`}>
                        <div className="ob-rxn-split-bg seen-bg" />
                        <div className="ob-rxn-split-bg unseen-bg" />
                        <div className="ob-rxn-split-line" />

                        <span className="ob-rxn-split-lbl seen-lbl">Visto</span>
                        <span className="ob-rxn-split-lbl unseen-lbl">Non visto</span>

                        <button className="ob-rxn-split-hit seen-hit" onClick={() => handleReaction("seen")} />
                        <button className="ob-rxn-split-hit unseen-hit" onClick={() => handleReaction("unseen")} />
                      </div>
                    </div>
                    {!allReacted && (
                      <div className="ob-nudge stage-nudge">valuta tutti i film per continuare</div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* bottom bar */}
            <div className="ob-botbar">
              <div className="ob-loved-row">
                <div className="ob-loved-txt">
                  {stepFilms.filter(f => reactions[f.id] === "loved").length > 0
                    ? `${stepFilms.filter(f => reactions[f.id] === "loved").length} ♥ in questo gruppo`
                    : "nessun film amato ancora"}
                </div>
              </div>
              <div className="ob-botright">
                <button
                  className={`ob-btn-cont ${allReacted || stepDone ? "on" : "off"}`}
                  disabled={!allReacted && !stepDone}
                  onClick={handleNextStep}
                >
                  {isLastStep ? "Vedi il riepilogo →" : "Prossimo gruppo →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CONFIRM — PYRAMID ═══ */}
        {phase === "confirm" && (() => {
          const rows = [
            pillars.slice(0, 1),
            pillars.slice(1, 3),
            pillars.slice(3, 6),
          ].filter(r => r.length > 0);

          return (
            <div className="ob-pyramid-shell">
              {/* Toggle Sidebar Button (Minimal Arrow) */}
              <button
                className={`ob-side-toggle ${isSideboardOpen ? 'open' : ''}`}
                onClick={() => setIsSideboardOpen(!isSideboardOpen)}
                title={isSideboardOpen ? "Chiudi" : "Film preferiti"}
              >
                <span className="ob-side-toggle-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </span>
              </button>

              {/* BACKDROP for Replace Sheet */}
              <div 
                className={`ob-rep-backdrop ${replacingPillar !== null ? 'active' : ''}`} 
                onClick={() => setReplacingPillar(null)}
              />

              {/* REPLACE SHEET (Bottom Sheet) */}
              <div className={`ob-rep-sheet ${replacingPillar !== null ? 'active' : ''}`}>
                <div className="ob-rep-header">
                  <h3 className="ob-rep-title">Scegli il <em>sostituto</em></h3>
                  <div className="ob-rep-sub">Film amati · non nei pilastri</div>
                  <button className="ob-rep-close" onClick={() => setReplacingPillar(null)}>✕</button>
                </div>
                <div className="ob-rep-grid">
                  {replacementCandidates.length === 0
                    ? <p className="ob-rep-empty">Nessun candidato disponibile</p>
                    : replacementCandidates.map(film => (
                      <div key={film.id} className="ob-rep-card" onClick={() => handleReplace(replacingPillar!, film)}>
                        <div className="ob-rep-card-poster">
                          <div style={{ ...filmGradient(film), width: "100%", height: "100%", display: "flex", alignItems: "flex-end", padding: "10px 8px" }}>
                            <span style={{ fontFamily: "var(--ob-serif)", fontSize: "11px", color: "#fff", lineHeight: 1.2 }}>{film.title}</span>
                          </div>
                        </div>
                        <div className="ob-rep-ct">{film.title}</div>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className={`ob-confirm-container ${isSideboardOpen ? 'side-open' : ''}`}>
                <div className="ob-pyramid-main">
                  <div className="ob-pyr-header">
                    <div>
                      <h2 className="ob-pyr-title">Il tuo<br /><em>profilo</em></h2>
                      <div className="ob-pyr-sub">Trascina per riordinare · hover per sostituire</div>
                    </div>
                    <div className="ob-pyr-hint">
                      Il vertice è<br />il tuo centro.<br />L&apos;ordine conta.
                    </div>
                  </div>

                  {pillars.length === 0 ? (
                    <div className="ob-pyr-empty">
                      <div className="ob-pyr-empty-title">Nessun film <em>amato</em></div>
                      <div className="ob-pyr-empty-sub">
                        Torna indietro e seleziona<br />almeno un film che ti ha colpito.
                      </div>
                    </div>
                  ) : (
                    <div className="ob-pyramid">
                      {rows.map((row, rowIdx) => (
                        <div key={rowIdx} className={`ob-pyr-row row-${rowIdx}`}>
                          {row.map((film) => {
                            const globalIdx = pillars.indexOf(film);
                            return (
                              <div
                                key={film.id}
                                className={`ob-pyr-card ${dragItem === globalIdx ? "drag-src" : ""} ${dragOver === globalIdx ? "drag-tgt" : ""}`}
                                data-rank={globalIdx}
                                draggable
                                onDragStart={() => onDragStart(globalIdx)}
                                onDragEnter={() => onDragEnter(globalIdx)}
                                onDragEnd={onDragEnd}
                                onDragOver={e => e.preventDefault()}
                                onDrop={() => onDrop(globalIdx)}
                              >
                                <div className="ob-pyr-rank-lbl">
                                  {globalIdx === 0 ? "▲ vertice" : `n° ${globalIdx + 1}`}
                                </div>
                                <div className="ob-pyr-poster">
                                  <div className="ob-pyr-poster-inner" style={filmGradient(film)}>
                                    <span className="ob-pyr-poster-title">{film.title}</span>
                                  </div>
                                  <button className="ob-pyr-rep" onClick={() => setReplacingPillar(globalIdx)}>↔ Sostituisci</button>
                                </div>
                                <div className="ob-pyr-name">{film.title}</div>
                                <div className="ob-pyr-meta">{film.director} · {film.year}</div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="ob-pyr-foot">
                    <div className="ob-pyr-count">
                      {pillars.length} {pillars.length === 1 ? "pilastro" : "pilastri"} selezionati
                    </div>
                    <button className="ob-btn-p" onClick={() => pageTransition(() => setPhase("streaming"))}>
                      Prosegui →
                    </button>
                  </div>
                </div>

                {/* Sidebar per altri film amati (Bottom Sheet) */}
                <div className={`ob-pyr-sidebar ${isSideboardOpen ? 'active' : ''}`}>
                  <div className="ob-side-header">
                    <h3 className="ob-side-title">Altri <em>preferiti</em></h3>
                    <p className="ob-side-sub">Film che hai amato</p>
                  </div>
                  <div className="ob-side-grid">
                    {replacementCandidates.length === 0 ? (
                      <p className="ob-side-empty">Nessun altro film amato</p>
                    ) : (
                      replacementCandidates.map(film => (
                        <div
                          key={film.id}
                          className="ob-side-card"
                          draggable
                          onDragStart={() => {
                            setDragItem(-1);
                            (window as any)._draggedSidebarFilm = film;
                          }}
                          onClick={() => setReplacingPillar(pillars.length - 1)}
                        >
                          <div className="ob-side-poster" style={filmGradient(film)}>
                            <span className="ob-side-poster-title">{film.title}</span>
                          </div>
                          <div className="ob-side-meta">
                            <div className="ob-side-name">{film.title}</div>
                            <div className="ob-side-year">{film.year}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ STREAMING SUBSCRIPTIONS ═══ */}
        {phase === "streaming" && (
          <div className="ob-streaming-shell">
            <div className="ob-welcome">
              <div className="ob-eyebrow">Ultimo passo</div>
              <h2 className="ob-w-title" style={{ fontSize: "clamp(36px, 8vw, 64px)", marginBottom: "20px" }}>Quali <em>abbonamenti</em><br />hai attivi?</h2>
              <p className="ob-w-sub">Così potremo illuminare i film già disponibili<br />sulle tue piattaforme.</p>
              
              <div className="ob-streaming-grid">
                {STREAMING_PLATFORMS.map(platform => {
                  const isSelected = subscriptions.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      className={`ob-streaming-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        if (isSelected) {
                          setSubscriptions(prev => prev.filter(id => id !== platform.id));
                        } else {
                          setSubscriptions(prev => [...prev, platform.id]);
                        }
                      }}
                    >
                      <div className="ob-streaming-check">{isSelected ? "✓" : "+"}</div>
                      {platform.name}
                    </button>
                  );
                })}
              </div>

              <div className="ob-streaming-foot" style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <button className="ob-btn-p" onClick={() => pageTransition(() => setPhase("demographics"))}>
                  Prosegui →
                </button>
                <div style={{ fontFamily: "var(--ob-mono)", fontSize: "9px", letterSpacing: "0.1em", opacity: 0.5, textTransform: "uppercase" }}>
                  I bottoni "Guarda ora su" si illumineranno per farti sapere quando un film è incluso.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ DEMOGRAPHICS ═══ */}
        {phase === "demographics" && (
          <div className="ob-streaming-shell">
            <div className="ob-welcome">
              <div className="ob-eyebrow">Quasi finito</div>
              <h2 className="ob-w-title" style={{ fontSize: "clamp(36px, 8vw, 64px)", marginBottom: "20px" }}>Un tocco di <em>realtà</em></h2>
              <p className="ob-w-sub">Per offrirti analisi più precise,<br />abbiamo bisogno di conoscerti un po&apos; meglio.</p>
              
              <div className="ob-demo-form" style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "24px", width: "100%", maxWidth: "400px" }}>
                <div className="ob-form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                  <label style={{ fontFamily: "var(--ob-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6 }}>Data di Nascita</label>
                  <input 
                    type="date" 
                    value={birthDate} 
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="ob-form-input date-fix"
                    style={{ 
                      width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--ob-cream-dark)",
                      background: "white", fontFamily: "var(--ob-mono)", fontSize: "14px", outline: "none",
                      minWidth: 0, WebkitAppearance: "none"
                    }}
                  />
                </div>

                <div className="ob-form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                  <label style={{ fontFamily: "var(--ob-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6 }}>Genere</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                    className="ob-form-input"
                    style={{ 
                      width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--ob-cream-dark)",
                      background: "white", fontFamily: "var(--ob-mono)", fontSize: "14px", outline: "none",
                      appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231A1614%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')",
                      backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "16px"
                    }}
                  >
                    <option value="Uomo">Uomo</option>
                    <option value="Donna">Donna</option>
                    <option value="Altro">Altro</option>
                    <option value="Non specificato">Non specificato</option>
                  </select>
                </div>

                <div className="ob-form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                  <label style={{ fontFamily: "var(--ob-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6 }}>Stato di Residenza</label>
                  <select 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    className="ob-form-input"
                    style={{ 
                      width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--ob-cream-dark)",
                      background: "white", fontFamily: "var(--ob-mono)", fontSize: "14px", outline: "none",
                      appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231A1614%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')",
                      backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "16px"
                    }}
                  >
                    {["Italia", "Stati Uniti", "Regno Unito", "Francia", "Germania", "Spagna", "Giappone", "Canada", "Australia", "Altro"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ob-streaming-foot" style={{ marginTop: "48px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <button className="ob-btn-p" onClick={handleConfirm} disabled={saving}>
                  {saving ? "Creando la tua Sfera..." : "Entra nella Sfera →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ DONE ═══ */}
        {phase === "done" && (
          <div className="ob-done">
            <div className="ob-eyebrow ob-au0">Onboarding completato</div>
            <h2 className="ob-done-title">La tua <em>Sfera</em><br />è pronta</h2>
            <p className="ob-done-body">
              I tuoi {pillars.length} pilastri del gusto sono stati registrati.
              Il grafo editoriale costruirà attorno a loro una costellazione di film
              connessi da fili invisibili ma precisi.
            </p>
            <div className="ob-done-thumbs">
              {pillars.map(film => (
                <div key={film.id} className="ob-done-thumb">
                  <div style={{ ...filmGradient(film), width: "100%", height: "100%" }} />
                </div>
              ))}
            </div>
            <button className="ob-btn-p" onClick={() => {
              console.log("Navigating to sphere...");
              setSaving(true);
              setTimeout(() => {
                window.location.href = "/sphere?completed=true";
              }, 800);
            }}>
              Entra nella Sfera →
            </button>
          </div>
        )}

      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CSS — prefixed with 'ob-' to avoid class collisions with the rest
   of the app. Ported from beta1.jsx with minimal changes.
   ═══════════════════════════════════════════════════════════════════ */
const ONBOARDING_CSS = `
*, *::before, *::after { box-sizing: border-box; }
:root {
  --ob-cream:      #F2EDE3;
  --ob-cream-dark: #E4DBCC;
  --ob-ink:        #1A1614;
  --ob-ink-light:  #4A4440;
  --ob-ink-faint:  #9A9490;
  --ob-gold:       #B8895A;
  --ob-gold-light: #D4A870;
  --ob-gold-faint: rgba(184,137,90,0.15);
  --ob-serif:      var(--font-geist-sans), sans-serif;
  --ob-mono:       var(--font-geist-mono), monospace;
  --ob-r:          3px;
}

.ob-root {
  height: 100dvh;
  background: var(--ob-cream);
  font-family: var(--ob-serif);
  color: var(--ob-ink);
  position: relative;
  overflow: hidden;
  transition: opacity 0.28s ease;
}
.ob-root.ob-faded { opacity: 0; pointer-events: none; }

/* subtle texture */
.ob-root::after {
  content: ''; position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}

/* ── WELCOME ── */
.ob-welcome {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: clamp(40px,10vw,88px) clamp(24px,6vw,64px);
  padding-top: calc(clamp(40px,10vw,88px) + env(safe-area-inset-top));
  text-align: center;
}
.ob-eyebrow {
  font-family: var(--ob-mono);
  font-size: clamp(9px,1.5vw,11px);
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--ob-gold);
  margin-bottom: clamp(20px,4vh,36px);
  animation: ob-au 0.55s ease both;
}
.ob-w-title {
  font-family: var(--ob-serif);
  font-size: clamp(48px,10vw,96px);
  font-weight: 800; line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 0 0 10px 0;
  animation: ob-au 0.55s 0.08s ease both;
}
.ob-w-title em { font-style: italic; color: var(--ob-gold); font-weight: 300; }
.ob-divider {
  width: 32px; height: 1px; background: var(--ob-gold);
  margin: clamp(18px,3vh,32px) auto;
  animation: ob-au 0.55s 0.16s ease both;
}
.ob-w-sub {
  font-size: clamp(15px,2.5vw,20px); font-weight: 400;
  color: var(--ob-ink-light); max-width: 460px;
  line-height: 1.65; margin: 0 0 clamp(14px,2vh,24px) 0;
  animation: ob-au 0.55s 0.16s ease both;
}
.ob-w-desc {
  font-family: var(--ob-mono);
  font-size: clamp(9px,1.4vw,10px);
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ob-ink-faint); max-width: 320px;
  line-height: 1.9; margin: 0 0 clamp(36px,6vh,60px) 0;
  animation: ob-au 0.55s 0.24s ease both;
}

/* ── BUTTONS ── */
.ob-btn-p {
  font-family: var(--ob-mono);
  font-size: clamp(10px,1.5vw,12px);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--ob-cream); background: var(--ob-ink);
  border: none; cursor: pointer; border-radius: var(--ob-r);
  padding: clamp(14px,2vh,18px) clamp(36px,5vw,56px);
  transition: background 0.22s, transform 0.12s;
}
.ob-btn-p:hover { background: var(--ob-gold); }
.ob-btn-p:active { transform: scale(0.97); }

/* ── STEP SHELL ── */
.ob-step-shell {
  position: relative; z-index: 1;
  height: 100%;
  display: grid;
  grid-template-rows: auto 2px 1fr auto;
}
.ob-topbar {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: max(clamp(16px, 2.5vh, 28px), env(safe-area-inset-top, 0px));
  padding-left: clamp(20px, 5vw, 56px);
  padding-right: clamp(20px, 5vw, 56px);
  padding-bottom: clamp(16px, 2.5vh, 28px);
  border-bottom: 1px solid var(--ob-cream-dark);
}
.ob-brand { font-family: var(--ob-serif); font-size: clamp(13px,2vw,16px); font-weight: 700; }
.ob-brand em { font-style: italic; color: var(--ob-gold); font-weight: 300; }
.ob-step-meta { display: flex; align-items: center; gap: 14px; }
.ob-step-dots { display: flex; gap: 7px; }
.ob-sdot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--ob-cream-dark); transition: background 0.2s;
}
.ob-sdot.active { background: var(--ob-gold); }
.ob-sdot.done   { background: var(--ob-ink-faint); }
.ob-step-lbl {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.2vw,10px);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--ob-ink-faint);
}

/* progress bar */
.ob-pbar { background: var(--ob-cream-dark); height: 2px; }
.ob-pbar-fill { height: 100%; background: var(--ob-gold); transition: width 0.35s ease; }

/* ── CARD STAGE ── */
.ob-stage {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: clamp(16px,3vw,40px) clamp(20px,5vw,56px);
  gap: clamp(16px,2.5vh,28px);
}
.ob-stage-headline { text-align: center; }
.ob-stage-headline h2 {
  font-family: var(--ob-serif);
  font-size: clamp(20px,4vw,36px); font-weight: 700;
  letter-spacing: -0.01em; line-height: 1.15; margin: 0 0 6px 0;
}
.ob-stage-headline h2 em { font-style: italic; color: var(--ob-gold); font-weight: 300; }
.ob-stage-headline p {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.2vw,10px);
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ob-ink-faint);
}

.ob-card-wrap {
  display: flex; flex-direction: column;
  align-items: center;
  gap: clamp(14px,2vh,22px);
  width: 100%;
}

.ob-film-card-sizer {
  height: clamp(220px, 46vh, 420px);
  aspect-ratio: 2/3;
  flex-shrink: 0;
  position: relative;
}

.ob-film-card {
  width: 100%; height: 100%;
  border-radius: 4px; overflow: hidden;
  position: relative;
  box-shadow: 0 20px 56px rgba(0,0,0,0.16), 0 4px 14px rgba(0,0,0,0.08);
  user-select: none;
  transition: transform 0.22s ease;
}
.ob-film-card:hover { transform: translateY(-3px) scale(1.005); }

.ob-fc-bg { position: absolute; inset: 0; }
.ob-fc-info {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  justify-content: space-between;
  padding: clamp(12px,3%,18px);
}
.ob-fc-mood {
  font-family: var(--ob-mono);
  font-size: clamp(7px,1vw,9px);
  letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(255,255,255,0.38); line-height: 1.6;
}
.ob-fc-title {
  font-family: var(--ob-serif);
  font-size: clamp(18px,3.5vw,28px); font-weight: 700;
  color: #fff; line-height: 1.2; margin-bottom: 4px;
}
.ob-fc-dir {
  font-family: var(--ob-mono);
  font-size: clamp(7px,1vw,9px);
  letter-spacing: 0.16em; text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}

/* dot trail */
.ob-f-dots { display: flex; gap: 7px; justify-content: center; }
.ob-fdot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--ob-cream-dark); transition: background 0.2s, transform 0.2s;
}
.ob-fdot.cur     { background: var(--ob-gold); transform: scale(1.4); }
.ob-fdot.loved   { background: var(--ob-gold-light); }
.ob-fdot.disliked{ background: var(--ob-ink-faint); }
.ob-fdot.unseen  { background: var(--ob-cream-dark); outline: 1px solid var(--ob-ink-faint); outline-offset: 1px; }

/* swipe hint */
.ob-swipe-hint {
  font-family: var(--ob-mono);
  font-size: 9px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--ob-ink-faint);
}

/* ── REACTION BUTTONS ── */
.ob-rxn-row {
  display: flex; gap: clamp(8px,1.5vw,12px);
  justify-content: center;
  width: 100%; max-width: 360px;
}
.ob-rxn-btn {
  flex: 1; min-width: 80px; max-width: 130px;
  display: flex; flex-direction: column;
  align-items: center; gap: 5px;
  padding: clamp(10px,1.8vh,14px) 8px;
  border-radius: var(--ob-r);
  border: 1.5px solid var(--ob-cream-dark);
  background: transparent; cursor: pointer;
  transition: background 0.17s, border-color 0.17s, transform 0.12s;
}
.ob-rxn-icon {
  font-size: clamp(18px,3vw,22px); line-height: 1;
  transition: transform 0.14s;
}
.ob-rxn-lbl {
  font-family: var(--ob-mono);
  font-size: clamp(7px,1vw,8px);
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--ob-ink-faint); text-align: center; line-height: 1.45;
}
.ob-rxn-btn.loved   { border-color: var(--ob-gold-faint); }
.ob-rxn-btn.loved:hover, .ob-rxn-btn.loved.active { background: var(--ob-gold); border-color: var(--ob-gold); }
.ob-rxn-btn.loved:hover .ob-rxn-icon, .ob-rxn-btn.loved.active .ob-rxn-icon { transform: scale(1.2); color: var(--ob-cream); }
.ob-rxn-btn.loved:hover .ob-rxn-lbl, .ob-rxn-btn.loved.active .ob-rxn-lbl  { color: rgba(255,255,255,0.75); }

.ob-rxn-btn.disliked:hover, .ob-rxn-btn.disliked.active { background: var(--ob-ink); border-color: var(--ob-ink); }
.ob-rxn-btn.disliked:hover .ob-rxn-lbl, .ob-rxn-btn.disliked.active .ob-rxn-lbl,
.ob-rxn-btn.disliked:hover .ob-rxn-icon, .ob-rxn-btn.disliked.active .ob-rxn-icon { color: #fff; }

.ob-rxn-btn:active { transform: scale(0.95); }

/* split btn */
.ob-rxn-split {
  flex: 1.5; min-width: 140px; max-width: 200px;
  position: relative; height: clamp(48px, 7vh, 64px);
  border-radius: var(--ob-r); border: 1.5px solid var(--ob-cream-dark);
  overflow: hidden; display: flex;
}
.ob-rxn-split-bg { position: absolute; inset: 0; pointer-events: none; transition: background 0.2s; }
.ob-rxn-split-line { position: absolute; left: 50%; top: 15%; bottom: 15%; width: 1px; background: var(--ob-cream-dark); z-index: 2; transition: opacity 0.2s; }

.ob-rxn-split-lbl {
  position: absolute; z-index: 3;
  font-family: var(--ob-mono); font-size: 7px;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ob-ink-faint); pointer-events: none;
  width: 50%; text-align: center; top: 50%; transform: translateY(-50%);
  transition: color 0.15s;
}
.ob-rxn-split-lbl.seen-lbl { left: 0; }
.ob-rxn-split-lbl.unseen-lbl { right: 0; }

.ob-rxn-split-hit { flex: 1; border: none; background: transparent; cursor: pointer; position: relative; z-index: 4; }
.ob-rxn-split-hit:hover + .ob-rxn-split-bg, .ob-rxn-split-hit:hover + * + .ob-rxn-split-bg { background: rgba(0,0,0,0.03); }

.ob-rxn-split.active-seen .seen-bg { background: var(--ob-ink-light); }
.ob-rxn-split.active-seen .seen-lbl { color: #fff; }
.ob-rxn-split.active-unseen .unseen-bg { background: var(--ob-cream-dark); }
.ob-rxn-split.active-unseen .unseen-lbl { color: var(--ob-ink); }
.ob-rxn-split.active-seen .ob-rxn-split-line, .ob-rxn-split.active-unseen .ob-rxn-split-line { opacity: 0; }

/* ── BOTTOM BAR ── */
.ob-botbar {
  border-top: 1px solid var(--ob-cream-dark);
  padding: clamp(12px,2vh,20px) clamp(20px,5vw,56px);
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
  background: var(--ob-cream);
  padding-bottom: calc(clamp(12px,2vh,20px) + env(safe-area-inset-bottom));
}
.ob-loved-row { display: flex; align-items: center; gap: 10px; }
.ob-loved-txt {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.1vw,10px);
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ob-ink-faint);
}
.ob-botright { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.ob-nudge {
  font-family: var(--ob-mono);
  font-size: 8px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--ob-gold);
}
.ob-btn-cont {
  font-family: var(--ob-mono);
  font-size: clamp(9px,1.3vw,11px);
  letter-spacing: 0.2em; text-transform: uppercase;
  padding: clamp(11px,1.7vh,15px) clamp(22px,3vw,36px);
  border: none; cursor: pointer; border-radius: var(--ob-r);
  transition: background 0.2s, transform 0.12s;
}
.ob-btn-cont.on  { background: var(--ob-ink); color: var(--ob-cream); }
.ob-btn-cont.on:hover  { background: var(--ob-gold); }
.ob-btn-cont.off { background: var(--ob-cream-dark); color: var(--ob-ink-faint); cursor: not-allowed; }

/* ── PYRAMID SHELL ── */
.ob-pyramid-shell {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: flex; flex-direction: column;
  padding: clamp(32px, 6vh, 60px) clamp(20px,4vw,48px) clamp(28px,5vw,56px);
  padding-top: calc(clamp(32px, 6vh, 60px) + env(safe-area-inset-top));
  gap: clamp(24px,4vh,40px);
}

.ob-pyr-header {
  display: flex; justify-content: space-between;
  align-items: flex-start; flex-wrap: wrap; gap: 16px;
  margin-bottom: clamp(12px, 2vh, 24px);
}
.ob-pyr-title {
  font-family: var(--ob-serif);
  font-size: clamp(32px,6vw,54px); font-weight: 700;
  letter-spacing: -0.01em; line-height: 1.05; margin: 0;
}
.ob-pyr-title em { font-style: italic; color: var(--ob-gold); font-weight: 300; }
.ob-pyr-sub {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.1vw,10px);
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ob-ink-faint); margin-top: 10px;
}
.ob-pyr-hint {
  font-family: var(--ob-mono);
  font-size: 9px;
  letter-spacing: 0.13em; text-transform: uppercase;
  color: var(--ob-ink-faint); line-height: 1.85;
  text-align: right; margin-top: 6px;
}

.ob-pyramid {
  display: flex; flex-direction: column;
  align-items: center;
  gap: clamp(16px,3vh,32px);
  flex: 1; justify-content: center;
  width: 100%;
}

.ob-pyr-row {
  display: flex; gap: clamp(12px,2vw,24px);
  justify-content: center; align-items: flex-start;
  width: 100%;
}

.ob-pyr-card {
  cursor: grab; transition: transform 0.2s, opacity 0.2s;
  position: relative; flex-shrink: 0;
  width: clamp(110px, 14vw, 160px); 
  display: flex; flex-direction: column;
}

@media (max-width: 640px) {
  .ob-pyramid { gap: 16px; }
  .ob-pyr-row { gap: 12px; }
  .ob-pyr-card { width: clamp(85px, 26vw, 120px); }
  .row-0 .ob-pyr-card { width: clamp(120px, 35vw, 160px); }
}

.ob-pyr-rank-lbl {
  font-family: var(--ob-mono);
  font-size: clamp(7px,0.9vw,9px);
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ob-gold);
  display: flex; align-items: center; gap: 5px;
  margin-bottom: 7px;
}
.ob-pyr-rank-lbl::after { content:''; flex:1; height:1px; background: var(--ob-gold-faint); }

.ob-pyr-poster {
  width: 100%; aspect-ratio: 2/3; border-radius: 3px;
  overflow: hidden; position: relative; margin-bottom: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
}
.ob-pyr-poster-inner {
  width: 100%; height: 100%;
  display: flex; align-items: flex-end;
  padding: clamp(8px,2%,14px);
}
.ob-pyr-poster-title {
  font-family: var(--ob-serif);
  font-size: clamp(10px,1.4vw,13px);
  color: #fff; line-height: 1.3; font-weight: 600;
}
.ob-pyr-rep {
  position: absolute; bottom:0; left:0; right:0;
  font-family: var(--ob-mono); font-size: 8px;
  letter-spacing: 0.1em; text-transform: uppercase;
  text-align: center; padding: 10px;
  background: rgba(0,0,0,0.85); color: #fff;
  border: none; cursor: pointer; width: 100%;
  opacity: 0; transition: opacity 0.2s;
}
.ob-pyr-card:hover .ob-pyr-rep { opacity: 1; }
.ob-pyr-name { font-family: var(--ob-serif); font-size: clamp(11px,1.4vw,14px); font-weight:700; line-height:1.3; margin-bottom:2px; }
.ob-pyr-meta { font-family:var(--ob-mono); font-size:clamp(7px,0.9vw,9px); letter-spacing:0.1em; color:var(--ob-ink-faint); text-transform:uppercase; }

/* ── SIDEBAR & SHEETS ── */
.ob-side-toggle {
  position: fixed; right: 0; top: 50%; transform: translateY(-50%);
  width: 32px; height: 64px; border-radius: 12px 0 0 12px;
  background: var(--ob-ink); color: #fff; border: none; cursor: pointer;
  z-index: 1100; display: flex; align-items: center; justify-content: center;
  box-shadow: -4px 0 16px rgba(0,0,0,0.15);
}
.ob-pyr-sidebar {
  position: fixed; right: 0; top: 0; bottom: 0; width: 280px;
  background: rgba(242, 237, 227, 0.98); backdrop-filter: blur(20px);
  border-left: 1px solid var(--ob-cream-dark);
  transform: translateX(100%); transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 1050; box-shadow: -15px 0 45px rgba(0,0,0,0.1);
  display: flex; flex-direction: column;
}
.ob-pyr-sidebar.active { transform: translateX(0); }
.ob-side-header { padding: 40px 30px 20px; border-bottom: 1px solid var(--ob-cream-dark); }
.ob-side-title { font-family: var(--ob-serif); font-size: 24px; font-weight: 700; }
.ob-side-title em { font-style: italic; color: var(--ob-gold); font-weight: 300; }

.ob-rep-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px); z-index: 1080; opacity: 0; pointer-events: none;
  transition: opacity 0.4s ease;
}
.ob-rep-backdrop.active { opacity: 1; pointer-events: auto; }
.ob-rep-sheet {
  position: fixed; bottom: 0; left: 0; right: 0; height: 85vh;
  background: var(--ob-cream); border-radius: 28px 28px 0 0;
  box-shadow: 0 -12px 60px rgba(0,0,0,0.15);
  transform: translateY(100%); transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 1090; display: flex; flex-direction: column;
}
.ob-rep-sheet.active { transform: translateY(0); }

/* Animations */
@keyframes ob-au { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:none; } }
@keyframes ob-checkPop { from { opacity:0; transform: scale(0.5); } to { opacity:1; transform: scale(1); } }

/* Done Phase */
.ob-done {
  position: relative; z-index:1;
  min-height: 100vh;
  display: flex; flex-direction:column;
  align-items:center; justify-content:center;
  text-align:center;
  padding: clamp(60px, 10vh, 100px) clamp(24px,6vw,60px);
}
.ob-done-title { font-family: var(--ob-serif); font-size:clamp(36px,8vw,80px); font-weight:700; letter-spacing:-0.025em; line-height:1.05; margin:0 0 18px 0; }
.ob-done-title em { font-style:italic; color:var(--ob-gold); font-weight: 300; }
.ob-done-body { font-size:clamp(14px,2vw,17px); font-weight:400; color:var(--ob-ink-light); max-width:440px; line-height:1.75; margin:0 0 40px 0; }
.ob-done-thumbs { display:flex; gap:12px; justify-content:center; margin-bottom:40px; }
.ob-done-thumb { width:clamp(52px,7vw,72px); aspect-ratio:2/3; border-radius:3px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.1); }

/* ── COMPLETION CARD ── */
.ob-done-card-sizer {
  padding: 20px;
  width: clamp(140px, 45vw, 240px);
  aspect-ratio: 2/3;
  flex-shrink: 0;
  animation: ob-au 0.4s ease both;
}
.ob-done-card {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px; border-radius: 4px; border: 1.5px solid var(--ob-cream-dark);
  background: rgba(242,237,227,0.4);
}
.ob-done-card-check {
  font-size: clamp(32px,5vw,48px);
  color: var(--ob-gold);
  line-height: 1;
  animation: ob-checkPop 0.4s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
}
.ob-done-card-label {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.1vw,10px);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--ob-ink-faint); text-align: center;
  line-height: 1.8;
}

/* ── NAV ARROWS ── */
.ob-nav-arrows {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 420px;
  padding: 0 4px;
}
.ob-nav-arrow {
  width: clamp(36px, 5vw, 44px);
  height: clamp(36px, 5vw, 44px);
  border-radius: 50%;
  border: 1.5px solid var(--ob-cream-dark);
  background: transparent;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: clamp(14px, 2vw, 18px);
  color: var(--ob-ink-light);
  transition: border-color 0.18s, background 0.18s, color 0.18s, transform 0.12s, opacity 0.18s;
  flex-shrink: 0;
}
.ob-nav-arrow:hover:not(:disabled) {
  border-color: var(--ob-gold);
  background: var(--ob-gold-faint);
  color: var(--ob-gold);
}
.ob-nav-arrow:active:not(:disabled) { transform: scale(0.93); }
.ob-nav-arrow:disabled { opacity: 0.22; cursor: not-allowed; }
.ob-nav-center { flex: 1; display: flex; justify-content: center; }

@keyframes ob-au {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:none; }
}
.ob-au0 { animation: ob-au 0.5s ease both; }
`;
