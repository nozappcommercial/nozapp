"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { OnboardingFilm } from "@/app/onboarding/page";

/* ─── IntersectionObserver hook for scroll reveal ─────────────── */
function useScrollReveal(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

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
  const [swapSource, setSwapSource] = useState<OnboardingFilm | null>(null);
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
          swapSource={swapSource}
          setSwapSource={setSwapSource}
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

/* ─── ConfirmPhase (scrollable page) ─────────────────────────────── */
interface ConfirmPhaseProps {
  pillars: OnboardingFilm[];
  setPillars: (p: OnboardingFilm[]) => void;
  lovedFilms: OnboardingFilm[];
  replacementCandidates: OnboardingFilm[];
  replacingPillar: number | null;
  setReplacingPillar: (n: number | null) => void;
  handleReplace: (idx: number, film: OnboardingFilm) => void;
  swapSource: OnboardingFilm | null;
  setSwapSource: (f: OnboardingFilm | null) => void;
  dragItem: number | null;
  dragOver: number | null;
  onDragStart: (idx: number) => void;
  onDragEnter: (idx: number) => void;
  onDragEnd: () => void;
  onDrop: (idx: number) => void;
  filmGradient: (film: OnboardingFilm) => React.CSSProperties;
  pageTransition: (fn: () => void) => void;
  setPhase: (p: Phase) => void;
}

function ConfirmPhase({
  pillars, setPillars, lovedFilms, replacementCandidates,
  replacingPillar, setReplacingPillar, handleReplace,
  swapSource, setSwapSource,
  dragItem, dragOver, onDragStart, onDragEnter, onDragEnd, onDrop,
  filmGradient, pageTransition, setPhase,
}: ConfirmPhaseProps) {
  const pyramidReveal = useScrollReveal(0.15);
  const extraReveal = useScrollReveal(0.15);

  const rows = [
    pillars.slice(0, 1),
    pillars.slice(1, 3),
    pillars.slice(3, 6),
  ].filter(r => r.length > 0);

  /* Click-click swap logic: click extra card → click pillar card */
  function handleExtraClick(film: OnboardingFilm) {
    if (swapSource?.id === film.id) {
      setSwapSource(null); // deselect
    } else {
      setSwapSource(film);
    }
  }
  function handlePillarClick(idx: number) {
    if (swapSource) {
      handleReplace(idx, swapSource);
      setSwapSource(null);
    } else {
      setReplacingPillar(idx);
    }
  }

  return (
    <div className="ob-confirm-scroll">
      {/* ─── Sezione A — Hero ─── */}
      <div className="ob-conf-hero">
        <h1 className="ob-conf-hero-title">
          Il tuo<br /><em>profilo</em>
        </h1>
        <div className="ob-conf-hero-sub">
          scorri per scoprire i tuoi pilastri
        </div>
        <div className="ob-conf-scroll-arrow">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* ─── Sezione B — Piramide ─── */}
      <div
        ref={pyramidReveal.ref}
        className={`ob-conf-section ${pyramidReveal.visible ? 'visible' : ''}`}
      >
        <div className="ob-pyr-header">
          <div>
            <h2 className="ob-pyr-title">I tuoi <em>pilastri</em></h2>
            <div className="ob-pyr-sub">Trascina per riordinare · click per sostituire</div>
          </div>
        </div>

        {pillars.length === 0 ? (
          <div className="ob-pyr-empty" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="ob-pyr-empty-title" style={{ fontFamily: 'var(--ob-serif)', fontSize: 'clamp(24px,5vw,40px)', fontWeight: 700, marginBottom: 12 }}>
              Nessun film <em style={{ fontStyle: 'italic', color: 'var(--ob-gold)', fontWeight: 300 }}>amato</em>
            </div>
            <div style={{ fontFamily: 'var(--ob-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--ob-ink-faint)' }}>
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
                      className={`ob-pyr-card ${dragItem === globalIdx ? "drag-src" : ""} ${dragOver === globalIdx ? "drag-tgt" : ""} ${swapSource ? "swap-ready" : ""}`}
                      data-rank={globalIdx}
                      draggable
                      onDragStart={() => onDragStart(globalIdx)}
                      onDragEnter={() => onDragEnter(globalIdx)}
                      onDragEnd={onDragEnd}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => onDrop(globalIdx)}
                      onClick={() => handlePillarClick(globalIdx)}
                    >
                      <div className="ob-pyr-rank-lbl">
                        {globalIdx === 0 ? "▲ vertice" : `n° ${globalIdx + 1}`}
                      </div>
                      <div className="ob-pyr-poster">
                        <div className="ob-pyr-poster-inner" style={filmGradient(film)}>
                          <span className="ob-pyr-poster-title">{film.title}</span>
                        </div>
                        {swapSource && (
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(184,137,90,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--ob-mono)', fontSize: '8px',
                            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                            color: '#fff',
                          }}>
                            ↔ Scambia
                          </div>
                        )}
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
      </div>

      {/* ─── Replace Modal (overlay) ─── */}
      {replacingPillar !== null && (
        <div className="ob-rep-overlay" onClick={() => setReplacingPillar(null)}>
          <div className="ob-rep-modal" onClick={e => e.stopPropagation()}>
            <div className="ob-rep-modal-header">
              <div className="ob-rep-modal-title">Scegli il <em>sostituto</em></div>
              <button className="ob-rep-modal-close" onClick={() => setReplacingPillar(null)}>✕</button>
            </div>
            <div className="ob-rep-modal-grid">
              {replacementCandidates.length === 0
                ? <p style={{ fontFamily: 'var(--ob-mono)', fontSize: '10px', color: 'var(--ob-ink-faint)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Nessun candidato disponibile</p>
                : replacementCandidates.map(film => (
                  <div key={film.id} className="ob-rep-modal-card" onClick={() => handleReplace(replacingPillar, film)}>
                    <div className="ob-rep-modal-poster" style={filmGradient(film)}>
                      <span>{film.title}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ─── Sezione C — Film extra (solo se più di 6 film amati) ─── */}
      {lovedFilms.length > 6 && (
        <div
          ref={extraReveal.ref}
          className={`ob-conf-section ${extraReveal.visible ? 'visible' : ''}`}
        >
          <h3 className="ob-extra-title">
            Altri film <em>amati</em>
          </h3>
          <div className="ob-extra-sub">
            Click su una card · poi click su un pilastro per scambiare
          </div>
          <div className="ob-extra-grid">
            {replacementCandidates.map(film => (
              <div
                key={film.id}
                className={`ob-extra-card ${swapSource?.id === film.id ? 'selected' : ''}`}
                onClick={() => handleExtraClick(film)}
              >
                <div className="ob-extra-poster" style={filmGradient(film)}>
                  <span>{film.title}</span>
                </div>
                <div className="ob-extra-name">{film.title}</div>
                <div className="ob-extra-meta">{film.director} · {film.year}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Footer ─── */}
      <div className="ob-pyr-foot">
        <div className="ob-pyr-count">
          {pillars.length} {pillars.length === 1 ? "pilastro" : "pilastri"} selezionati
        </div>
        <button className="ob-btn-p" onClick={() => pageTransition(() => setPhase("streaming"))}>
          Prosegui →
        </button>
      </div>
    </div>
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
  --ob-serif:      'Cormorant Garamond', Georgia, serif;
  --ob-mono:       'Fragment Mono', monospace;
  --ob-r:          3px;
}

.ob-root {
  min-height: 100dvh;
  background: var(--ob-cream);
  font-family: var(--ob-serif);
  color: var(--ob-ink);
  position: relative;
  transition: opacity 0.28s ease;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
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
  height: 100dvh;
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

/* unseen-split btn (terzo bottone) */
.ob-rxn-btn.unseen-split { position: relative; overflow: hidden; }
.ob-rxn-btn.unseen-split .ob-rxn-icon { color: var(--ob-ink-faint); transition: color 0.18s; }
.ob-rxn-btn.unseen-split.active-u { background: var(--ob-cream-dark); border-color: var(--ob-ink-faint); }
.ob-rxn-btn.unseen-split.active-u .ob-rxn-icon { color: var(--ob-ink); }
.ob-rxn-btn.unseen-split.active-u .ob-rxn-lbl { color: var(--ob-ink); }
.ob-rxn-btn.unseen-split.active-s { background: var(--ob-ink-light); border-color: var(--ob-ink-light); }
.ob-rxn-btn.unseen-split.active-s .ob-rxn-icon { color: #fff; }
.ob-rxn-btn.unseen-split.active-s .ob-rxn-lbl { color: rgba(255,255,255,0.75); }
/* diagonal slash inside the button */
.ob-rxn-btn.unseen-split::after {
  content: ''; position: absolute;
  top: 4px; right: 4px; bottom: 4px; left: 4px;
  border-right: 1px solid var(--ob-cream-dark);
  transform: rotate(-35deg); pointer-events: none;
  opacity: 0.5;
}
.ob-rxn-btn.unseen-split.active-u::after,
.ob-rxn-btn.unseen-split.active-s::after { opacity: 0; }

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
  font-size: clamp(8px,1.1vw,10px);
  letter-spacing: 0.2em; text-transform: uppercase;
  padding: clamp(9px,1.4vh,12px) clamp(18px,2.5vw,28px);
  border: none; cursor: pointer; border-radius: var(--ob-r);
  transition: background 0.2s, transform 0.12s;
}
.ob-btn-cont.on  { background: var(--ob-ink); color: var(--ob-cream); }
.ob-btn-cont.on:hover  { background: var(--ob-gold); }
.ob-btn-cont.off { background: var(--ob-cream-dark); color: var(--ob-ink-faint); cursor: not-allowed; }

/* ── CONFIRM SCROLL PAGE ── */
.ob-confirm-scroll {
  position: relative; z-index: 1;
  min-height: 100vh;
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100dvh;
  width: 100%;
}

/* Section A — Hero */
.ob-conf-hero {
  min-height: 100dvh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  padding: clamp(60px, 12vh, 100px) clamp(24px,6vw,64px);
  position: relative;
  scroll-snap-align: start;
}
.ob-conf-hero-title {
  font-family: var(--ob-serif);
  font-size: clamp(48px,10vw,96px); font-weight: 700;
  letter-spacing: -0.025em; line-height: 1.02; margin: 0;
}
.ob-conf-hero-title em { font-style: italic; color: var(--ob-gold); font-weight: 300; }
.ob-conf-hero-sub {
  font-family: var(--ob-mono);
  font-size: clamp(9px,1.2vw,11px);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--ob-ink-faint); margin-top: 20px;
}
.ob-conf-scroll-arrow {
  position: absolute; bottom: clamp(32px, 6vh, 60px);
  left: 50%; transform: translateX(-50%);
  animation: ob-bounce 2s ease-in-out infinite;
  color: var(--ob-gold); opacity: 0.6;
}
@keyframes ob-bounce {
  0%,100% { transform: translateX(-50%) translateY(0); }
  50%     { transform: translateX(-50%) translateY(12px); }
}

/* Section B — Pyramid */
.ob-conf-section {
  min-height: 100dvh;
  padding: clamp(24px, 4vh, 48px) clamp(16px,3vw,32px);
  opacity: 0; transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  scroll-snap-align: start;
  display: flex; flex-direction: column;
  justify-content: center;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
}
.ob-conf-section.visible {
  opacity: 1; transform: none;
}

.ob-pyr-header {
  display: flex; justify-content: space-between;
  align-items: flex-start; flex-wrap: wrap; gap: 12px;
  margin-bottom: clamp(12px, 2vh, 20px);
  max-width: 900px; margin-left: auto; margin-right: auto;
}
.ob-pyr-title {
  font-family: var(--ob-serif);
  font-size: clamp(24px,5vw,42px); font-weight: 700;
  letter-spacing: -0.01em; line-height: 1.05; margin: 0;
}
.ob-pyr-title em { font-style: italic; color: var(--ob-gold); font-weight: 300; }
.ob-pyr-sub {
  font-family: var(--ob-mono);
  font-size: clamp(7px,1vw,9px);
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ob-ink-faint); margin-top: 6px;
}

.ob-pyramid {
  display: flex; flex-direction: column;
  align-items: center;
  gap: clamp(10px,1.8vh,20px);
  width: 100%; max-width: 900px;
  margin: 0 auto;
}

.ob-pyr-row {
  display: flex; gap: clamp(8px,1.5vw,18px);
  justify-content: center; align-items: flex-start;
  width: 100%;
  overflow: hidden;
  flex-wrap: wrap;
}

.ob-pyr-card {
  cursor: grab; transition: transform 0.2s, opacity 0.2s;
  position: relative;
  width: clamp(100px, 13vw, 150px);
  min-width: 0;
  display: flex; flex-direction: column;
}

@media (max-width: 640px) {
  .ob-pyramid { gap: 10px; }
  .ob-pyr-row { gap: 8px; }
  .ob-pyr-card { width: clamp(80px, 25vw, 105px); }
  .row-0 .ob-pyr-card { width: clamp(100px, 30vw, 130px); }
  .ob-pyr-rank-lbl { font-size: 6px; margin-bottom: 3px; }
  .ob-pyr-poster { margin-bottom: 4px; }
  .ob-pyr-name { font-size: 10px; }
  .ob-pyr-meta { font-size: 7px; }
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

/* ── REPLACE MODAL (overlay) ── */
.ob-rep-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 1080; display: flex;
  align-items: center; justify-content: center;
  animation: ob-fadeIn 0.3s ease both;
}
@keyframes ob-fadeIn { from { opacity: 0; } to { opacity: 1; } }
.ob-rep-modal {
  background: var(--ob-cream);
  border-radius: 16px; padding: clamp(24px,4vw,40px);
  max-width: 560px; width: 90vw;
  max-height: 80vh; overflow-y: auto;
  box-shadow: 0 24px 80px rgba(0,0,0,0.25);
  animation: ob-modalIn 0.4s cubic-bezier(0.19,1,0.22,1) both;
}
@keyframes ob-modalIn { from { opacity:0; transform: translateY(24px) scale(0.97); } to { opacity:1; transform: none; } }
.ob-rep-modal-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
}
.ob-rep-modal-title { font-family: var(--ob-serif); font-size: clamp(20px,4vw,28px); font-weight: 700; }
.ob-rep-modal-title em { font-style: italic; color: var(--ob-gold); font-weight: 300; }
.ob-rep-modal-close {
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid var(--ob-cream-dark); background: transparent;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: var(--ob-ink-light);
  transition: background 0.18s;
}
.ob-rep-modal-close:hover { background: var(--ob-cream-dark); }
.ob-rep-modal-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}
.ob-rep-modal-card {
  cursor: pointer; border-radius: 4px; overflow: hidden;
  transition: transform 0.18s, box-shadow 0.18s;
}
.ob-rep-modal-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.ob-rep-modal-poster {
  width: 100%; aspect-ratio: 2/3;
  display: flex; align-items: flex-end; padding: 8px;
}
.ob-rep-modal-poster span {
  font-family: var(--ob-serif); font-size: 11px; color: #fff; line-height: 1.2;
}

/* ── Sezione C — Film extra ── */
.ob-extra-title {
  font-family: var(--ob-serif);
  font-size: clamp(24px,5vw,40px); font-weight: 700;
  letter-spacing: -0.01em; margin: 0 0 8px 0;
  max-width: 900px; margin-left: auto; margin-right: auto;
  padding: 0 clamp(12px, 3vw, 24px);
  text-align: center;
  width: 100%; box-sizing: border-box;
}
.ob-extra-title em { font-style: italic; color: var(--ob-gold); font-weight: 300; }
.ob-extra-sub {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1vw,10px);
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ob-ink-faint); margin-bottom: 24px;
  max-width: 900px; margin-left: auto; margin-right: auto;
  padding: 0 clamp(12px, 3vw, 24px);
  text-align: center;
  width: 100%; box-sizing: border-box;
}
.ob-extra-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: clamp(8px, 2vw, 16px); max-width: 900px; margin: 0 auto;
  padding: 0 clamp(12px, 3vw, 24px);
  width: 100%;
  box-sizing: border-box;
}
@media (max-width: 360px) {
  .ob-extra-grid { grid-template-columns: repeat(2, 1fr); }
}
.ob-extra-card {
  cursor: pointer; border-radius: 4px; overflow: hidden;
  transition: transform 0.18s, box-shadow 0.18s;
  border: 2px solid transparent;
}
.ob-extra-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.ob-extra-card.selected { border-color: var(--ob-gold); }
.ob-extra-poster {
  width: 100%; aspect-ratio: 2/3;
  display: flex; align-items: flex-end; padding: 8px;
}
.ob-extra-poster span {
  font-family: var(--ob-serif); font-size: 11px; color: #fff; line-height: 1.2;
}
.ob-extra-name { font-family: var(--ob-serif); font-size: 12px; font-weight: 700; padding: 6px 4px 2px; }
.ob-extra-meta { font-family: var(--ob-mono); font-size: 8px; color: var(--ob-ink-faint); letter-spacing: 0.1em; text-transform: uppercase; padding: 0 4px 8px; }

/* ── CONFIRM FOOTER ── */
.ob-pyr-foot {
  display: flex; flex-direction: column;
  align-items: center; gap: 16px;
  padding: clamp(40px, 6vh, 60px) 20px;
  max-width: 900px; margin: 0 auto;
}
.ob-pyr-count {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1vw,10px);
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ob-ink-faint);
}

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
  display: flex; flex-direction: column;
  align-items: center; gap: 16px;
  padding: 12px;
  flex-shrink: 0;
  animation: ob-au 0.4s ease both;
}
.ob-done-card {
  width: clamp(120px, 38vw, 200px);
  aspect-ratio: 2/3;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 14px; border-radius: 4px; border: 1.5px solid var(--ob-cream-dark);
  background: rgba(242,237,227,0.4);
}
.ob-done-card-check {
  font-size: clamp(28px, 4vw, 40px);
  color: var(--ob-gold);
  line-height: 1;
  animation: ob-checkPop 0.4s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
}
.ob-done-card-label {
  font-family: var(--ob-mono);
  font-size: clamp(7px,1vw,9px);
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ob-ink-faint); text-align: center;
  line-height: 1.7;
}
.ob-done-card-summary {
  font-family: var(--ob-mono);
  font-size: clamp(8px, 1.1vw, 10px);
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--ob-ink-faint); text-align: center;
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

/* ── STREAMING GRID ── */
.ob-streaming-shell {
  position: relative; z-index: 1;
}
.ob-streaming-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(8px, 1.5vw, 12px);
  width: 100%; max-width: 420px;
  margin: clamp(24px, 4vh, 40px) auto 0;
}
@media (max-width: 400px) {
  .ob-streaming-grid { grid-template-columns: repeat(2, 1fr); }
}
.ob-streaming-btn {
  display: flex; align-items: center; gap: 8px;
  padding: clamp(10px, 1.8vh, 14px) clamp(10px, 2vw, 16px);
  border-radius: var(--ob-r);
  border: 1.5px solid var(--ob-cream-dark);
  background: transparent; cursor: pointer;
  font-family: var(--ob-mono);
  font-size: clamp(8px, 1.2vw, 10px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ob-ink-light);
  transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s;
  white-space: nowrap;
  text-align: left;
}
.ob-streaming-btn:hover {
  border-color: var(--ob-gold-faint);
  background: var(--ob-gold-faint);
}
.ob-streaming-btn.active {
  background: var(--ob-ink);
  border-color: var(--ob-ink);
  color: var(--ob-cream);
}
.ob-streaming-btn:active { transform: scale(0.96); }
.ob-streaming-check {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--ob-cream-dark);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; line-height: 1;
  flex-shrink: 0;
  transition: background 0.18s, border-color 0.18s;
}
.ob-streaming-btn.active .ob-streaming-check {
  background: var(--ob-gold);
  border-color: var(--ob-gold);
  color: #fff;
}

/* ── CONFIRM FOOTER SNAP ── */
.ob-pyr-foot {
  scroll-snap-align: start;
}
`;
