"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { OnboardingFilm } from "@/app/onboarding/page";

/* ─── Constants ─────────────────────────────────────────────────── */
const FONTS_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap";
const MAX_PILLARS = 6;

type Reaction = "loved" | "disliked" | "seen" | "unseen";
type Phase = "welcome" | "step" | "confirm" | "done";

interface OnboardingFlowProps {
  films: OnboardingFilm[];
}

/* ─── Helpers ───────────────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function OnboardingFlow({ films }: OnboardingFlowProps) {
  const isMobile = useIsMobile();

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
        reactions: Object.entries(reactions).map(([filmId, reaction]) => ({
          filmId: Number(filmId),
          reaction,
        })),
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
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS_URL} />


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
                {!stepDone && (
                  <div className="ob-rxn-row">
                    <button className="ob-rxn-btn loved" onClick={() => handleReaction("loved")}>
                      <span className="ob-rxn-icon" style={{ color: "var(--ob-gold)" }}>♥</span>
                      <span className="ob-rxn-lbl">L&apos;ho<br />amato</span>
                    </button>
                    <button className="ob-rxn-btn disliked" onClick={() => handleReaction("disliked")}>
                      <span className="ob-rxn-icon" style={{ color: "var(--ob-ink-light)" }}>✕</span>
                      <span className="ob-rxn-lbl">Non fa<br />per me</span>
                    </button>

                    <div className="ob-rxn-split">
                      <div className="ob-rxn-split-bg seen-bg" />
                      <div className="ob-rxn-split-bg unseen-bg" />
                      <div className="ob-rxn-split-line" />

                      <span className="ob-rxn-split-lbl seen-lbl">Visto</span>
                      <span className="ob-rxn-split-lbl unseen-lbl">Non visto</span>

                      <button className="ob-rxn-split-hit seen-hit" onClick={() => handleReaction("seen")} />
                      <button className="ob-rxn-split-hit unseen-hit" onClick={() => handleReaction("unseen")} />
                    </div>
                  </div>
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
                {!stepDone && !allReacted && (
                  <div className="ob-nudge">valuta tutti i film per continuare</div>
                )}
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
              {/* Toggle Sidebar Button */}
              <button
                className={`ob-side-toggle ${isSideboardOpen ? 'open' : ''}`}
                onClick={() => setIsSideboardOpen(!isSideboardOpen)}
                title={isSideboardOpen ? "Chiudi galleria" : "Apri galleria film amati"}
              >
                <span className="ob-side-toggle-icon">‹</span>
              </button>

              {replacingPillar !== null && (
                <div className="ob-rep-overlay">
                  <h3 className="ob-rep-title">Scegli il <em>sostituto</em></h3>
                  <div className="ob-rep-sub">Film che hai amato · non ancora nei pilastri</div>
                  <div className="ob-rep-grid">
                    {replacementCandidates.length === 0
                      ? <p className="ob-rep-empty">Nessun candidato disponibile</p>
                      : replacementCandidates.map(film => (
                        <div key={film.id} className="ob-rep-card" onClick={() => handleReplace(replacingPillar, film)}>
                          <div className="ob-rep-card-poster">
                            <div style={{ ...filmGradient(film), width: "100%", height: "100%", display: "flex", alignItems: "flex-end", padding: "10px 8px" }}>
                              <span style={{ fontFamily: "var(--ob-serif)", fontSize: "11px", color: "#fff", lineHeight: 1.3 }}>{film.title}</span>
                            </div>
                          </div>
                          <div className="ob-rep-ct">{film.title}</div>
                          <div className="ob-rep-cy">{film.year}</div>
                        </div>
                      ))
                    }
                  </div>
                  <button className="ob-btn-g" onClick={() => setReplacingPillar(null)}>Annulla</button>
                </div>
              )}

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
                      {pillars.length} {pillars.length === 1 ? "pilastro" : "pilastri"} · pronto per la sfera
                    </div>
                    <button className="ob-btn-p" onClick={handleConfirm} disabled={saving}>
                      {saving ? "Salvataggio..." : "Entra nella Sfera →"}
                    </button>
                  </div>
                </div>

                {/* Sidebar per altri film amati (Sliding) */}
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
                            // logic to treat this as a "virtual" index or handle specifically
                            setDragItem(-1); // special mark for sidebar items?
                            // Actually, let's just make it possible to swap the dragged item with a pillar
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
