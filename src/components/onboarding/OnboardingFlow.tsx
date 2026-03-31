"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import ConfirmPhase from "./ConfirmPhase";
import { ONBOARDING_CSS } from "./onboarding.css";
import {
  type OnboardingFilm,
  type Reaction,
  type Phase,
  MAX_PILLARS,
  STREAMING_PLATFORMS,
} from "./types";

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
    setTimeout(() => {
      setDragItem(null); setDragOver(null);
      delete (window as any)._draggedSidebarFilm;
    }, 50);
  }

  function onDrop(idx: number) {
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
        reactions,
        streaming_subscriptions: subscriptions,
        birth_date: birthDate,
        country: country,
        gender: gender,
        timestamp: new Date().toISOString(),
      };

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
                    <div className="ob-done-card-summary">
                      {stepFilms.filter(f => reactions[f.id] === 'loved').length} amati
                      &nbsp;·&nbsp;
                      {stepFilms.filter(f => reactions[f.id] === 'disliked').length} scartati
                      &nbsp;·&nbsp;
                      {stepFilms.filter(f => reactions[f.id] === 'unseen' || reactions[f.id] === 'seen').length} altri
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

                {/* reaction buttons — 3 bottoni uniformi */}
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

                      <button
                        className={`ob-rxn-btn unseen-split ${reactions[currentFilm.id] === 'seen' ? 'active-s' : reactions[currentFilm.id] === 'unseen' ? 'active-u' : ''}`}
                        onClick={() => handleReaction(
                          reactions[currentFilm.id] === 'unseen' ? 'seen' : 'unseen'
                        )}
                      >
                        <span className="ob-rxn-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="4" y1="4" x2="20" y2="20"/>
                          </svg>
                        </span>
                        <span className="ob-rxn-lbl">
                          {reactions[currentFilm.id] === 'seen' ? <>Visto</> : <>Non l&apos;ho<br/>visto</>}
                        </span>
                      </button>
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

        {/* ═══ CONFIRM — SCROLLABLE PAGE ═══ */}
        {phase === "confirm" && <ConfirmPhase
          pillars={pillars}
          setPillars={setPillars}
          lovedFilms={lovedFilms}
          replacementCandidates={replacementCandidates}
          replacingPillar={replacingPillar}
          setReplacingPillar={setReplacingPillar}
          handleReplace={handleReplace}
          dragItem={dragItem}
          dragOver={dragOver}
          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
          filmGradient={filmGradient}
          pageTransition={pageTransition}
          setPhase={setPhase}
        />}

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
                      {'logo' in platform && platform.logo ? (
                        <img src={platform.logo} alt={platform.name} className="ob-streaming-logo" />
                      ) : (
                        <span className="ob-streaming-name">{platform.name}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="ob-streaming-foot" style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <button className="ob-btn-p" onClick={() => pageTransition(() => setPhase("demographics"))}>
                  Prosegui →
                </button>
                <div style={{ fontFamily: "var(--ob-mono)", fontSize: "9px", letterSpacing: "0.1em", opacity: 0.5, textTransform: "uppercase" }}>
                  I bottoni &quot;Guarda ora su&quot; si illumineranno per farti sapere quando un film è incluso.
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
