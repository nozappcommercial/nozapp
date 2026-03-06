import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');`;

const FILMS = [
  { id: 1, title: "Il Padrino", year: 1972, director: "Francis Ford Coppola", color: "#2C1810", accent: "#8B4513", mood: "Potere, famiglia, tragedia" },
  { id: 2, title: "Pulp Fiction", year: 1994, director: "Quentin Tarantino", color: "#1A0A00", accent: "#E8A000", mood: "Violenza, umorismo, destino" },
  { id: 3, title: "Titanic", year: 1997, director: "James Cameron", color: "#0A1628", accent: "#4A7FBF", mood: "Amore, tragedia, classe sociale" },
  { id: 4, title: "Schindler's List", year: 1993, director: "Steven Spielberg", color: "#0D0D0D", accent: "#C8C8C8", mood: "Memoria, redenzione, orrore" },
  { id: 5, title: "The Dark Knight", year: 2008, director: "Christopher Nolan", color: "#0A0A14", accent: "#4A90D9", mood: "Caos, morale, vigilantismo" },
  { id: 6, title: "Her", year: 2013, director: "Spike Jonze", color: "#8B1A1A", accent: "#E8937A", mood: "Solitudine, connessione, futuro" },
  { id: 7, title: "Parasite", year: 2019, director: "Bong Joon-ho", color: "#1C2B1C", accent: "#7AB87A", mood: "Classe, inganno, brutalità" },
  { id: 8, title: "Moonlight", year: 2016, director: "Barry Jenkins", color: "#0D1A2B", accent: "#4A7FA8", mood: "Identità, tenerezza, silenzio" },
  { id: 9, title: "Mad Max: Fury Road", year: 2015, director: "George Miller", color: "#3D1C00", accent: "#FF6B00", mood: "Sopravvivenza, furia, libertà" },
  { id: 10, title: "Arrival", year: 2016, director: "Denis Villeneuve", color: "#0A1520", accent: "#5A8FA0", mood: "Tempo, linguaggio, perdita" },
  { id: 11, title: "In the Mood for Love", year: 2000, director: "Wong Kar-wai", color: "#2B0A14", accent: "#C84A6A", mood: "Desiderio, distanza, tempo" },
  { id: 12, title: "2001: Odissea nello Spazio", year: 1968, director: "Stanley Kubrick", color: "#000814", accent: "#4A6080", mood: "Umanità, evoluzione, infinito" },
  { id: 13, title: "The Tree of Life", year: 2011, director: "Terrence Malick", color: "#1A2B0A", accent: "#8FBF5A", mood: "Grazia, natura, trascendenza" },
  { id: 14, title: "Jeanne Dielman", year: 1975, director: "Chantal Akerman", color: "#1E1A14", accent: "#A89070", mood: "Routine, corpo, oppressione" },
  { id: 15, title: "Yi Yi", year: 2000, director: "Edward Yang", color: "#141E28", accent: "#7A9EB8", mood: "Famiglia, comunicazione, vita" },
];

const STEPS = [FILMS.slice(0, 5), FILMS.slice(5, 10), FILMS.slice(10, 15)];
const MIN_LOVED = 3;
const MAX_PILLARS = 5;

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function OnboardingSimulation() {
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState("welcome");
  const [currentStep, setCurrentStep] = useState(0);
  const [filmIndex, setFilmIndex] = useState(0);
  const [reactions, setReactions] = useState({});
  const [pillars, setPillars] = useState([]);
  const [cardAnim, setCardAnim] = useState("idle");
  const [stepDone, setStepDone] = useState(false);
  const [replacingPillar, setReplacingPillar] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [dragItem, setDragItem] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const touchStartX = useRef(null);

  const lovedFilms = FILMS.filter(f => reactions[f.id] === "loved");
  const totalLoved = lovedFilms.length;

  const stepFilms = STEPS[currentStep];
  const currentFilm = stepFilms[filmIndex];
  const isLastFilmInStep = filmIndex === stepFilms.length - 1;
  const isLastStep = currentStep === STEPS.length - 1;
  const allReacted = stepFilms.every(f => reactions[f.id]);
  const canGoNext = allReacted;

  function pageTransition(fn) {
    setFadeIn(false);
    setTimeout(() => { fn(); setFadeIn(true); }, 280);
  }

  function animateCard(type, afterFn) {
    setCardAnim(`exit-${type}`);
    setTimeout(() => {
      afterFn();
      setCardAnim("enter");
      setTimeout(() => setCardAnim("idle"), 320);
    }, 260);
  }

  function handleReaction(key) {
    if (stepDone) return;
    const film = currentFilm;
    animateCard(key, () => {
      const updated = { ...reactions, [film.id]: key };
      setReactions(updated);
      if (isLastFilmInStep) {
        // show completion card
        setTimeout(() => setStepDone(true), 80);
      } else {
        setFilmIndex(i => i + 1);
      }
    });
  }

  function navigateTo(idx) {
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

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 48) return;
    handleReaction(dx > 0 ? "loved" : "disliked");
  }

  function onDragStart(idx) { setDragItem(idx); }
  function onDragEnter(idx) { setDragOver(idx); }
  function onDragEnd() {
    if (dragItem !== null && dragOver !== null && dragItem !== dragOver) {
      const next = [...pillars];
      const [r] = next.splice(dragItem, 1);
      next.splice(dragOver, 0, r);
      setPillars(next);
    }
    setDragItem(null); setDragOver(null);
  }

  function handleReplace(idx, film) {
    const next = [...pillars]; next[idx] = film; setPillars(next);
    setReplacingPillar(null);
  }

  const replacementCandidates = lovedFilms.filter(f => !pillars.find(p => p.id === f.id));

  const cardStyle = (() => {
    const t = "opacity 0.22s ease, transform 0.22s ease";
    if (cardAnim === "exit-loved") return { style: { opacity: 0, transform: "translateX(70px) rotate(8deg)", transition: t } };
    if (cardAnim === "exit-disliked") return { style: { opacity: 0, transform: "translateX(-70px) rotate(-8deg)", transition: t } };
    if (cardAnim === "exit-unseen") return { style: { opacity: 0, transform: "translateY(-40px) scale(0.96)", transition: t } };
    if (cardAnim === "exit-nav-fwd") return { style: { opacity: 0, transform: "translateX(-32px)", transition: t } };
    if (cardAnim === "exit-nav-bck") return { style: { opacity: 0, transform: "translateX(32px)", transition: t } };
    if (cardAnim === "enter") return { style: { opacity: 0, transform: "translateY(12px)", transition: "none" } };
    return { style: { opacity: 1, transform: "none", transition: t } };
  })();

  const progressPct = (filmIndex / stepFilms.length) * 100;

  return (
    <>
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --cream:      #F2EDE3;
          --cream-dark: #E4DBCC;
          --ink:        #1A1614;
          --ink-light:  #4A4440;
          --ink-faint:  #9A9490;
          --gold:       #B8895A;
          --gold-light: #D4A870;
          --gold-faint: rgba(184,137,90,0.15);
          --serif:      'Cormorant Garamond', Georgia, serif;
          --mono:       'Courier Prime', monospace;
          --r:          3px;
        }
        html, body { height: 100%; background: var(--cream); }

        .root {
          min-height: 100vh;
          background: var(--cream);
          font-family: var(--serif);
          color: var(--ink);
          position: relative;
          overflow-x: hidden;
          transition: opacity 0.28s ease;
        }
        .root.faded { opacity: 0; pointer-events: none; }

        /* subtle texture */
        .root::after {
          content: ''; position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }

        /* ── WELCOME ── */
        .welcome {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: clamp(40px,10vw,88px) clamp(24px,6vw,64px);
          text-align: center;
        }
        .eyebrow {
          font-family: var(--mono);
          font-size: clamp(9px,1.5vw,11px);
          letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--gold);
          margin-bottom: clamp(20px,4vh,36px);
          animation: au 0.55s ease both;
        }
        .w-title {
          font-size: clamp(48px,10vw,96px);
          font-weight: 300; line-height: 1.02;
          letter-spacing: -0.025em;
          margin-bottom: 10px;
          animation: au 0.55s 0.08s ease both;
        }
        .w-title em { font-style: italic; color: var(--gold); }
        .divider {
          width: 32px; height: 1px; background: var(--gold);
          margin: clamp(18px,3vh,32px) auto;
          animation: au 0.55s 0.16s ease both;
        }
        .w-sub {
          font-size: clamp(15px,2.5vw,20px); font-weight: 300;
          color: var(--ink-light); max-width: 460px;
          line-height: 1.65; margin-bottom: clamp(14px,2vh,24px);
          animation: au 0.55s 0.16s ease both;
        }
        .w-desc {
          font-family: var(--mono);
          font-size: clamp(9px,1.4vw,10px);
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--ink-faint); max-width: 320px;
          line-height: 1.9; margin-bottom: clamp(36px,6vh,60px);
          animation: au 0.55s 0.24s ease both;
        }

        /* ── BUTTONS ── */
        .btn-p {
          font-family: var(--mono);
          font-size: clamp(10px,1.5vw,12px);
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--cream); background: var(--ink);
          border: none; cursor: pointer; border-radius: var(--r);
          padding: clamp(14px,2vh,18px) clamp(36px,5vw,56px);
          transition: background 0.22s, transform 0.12s;
          animation: au 0.55s 0.32s ease both;
        }
        .btn-p:hover  { background: var(--gold); }
        .btn-p:active { transform: scale(0.97); }

        .btn-g {
          font-family: var(--mono);
          font-size: clamp(9px,1.3vw,11px);
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ink-faint); background: transparent;
          border: 1px solid var(--cream-dark);
          cursor: pointer; border-radius: var(--r);
          padding: clamp(12px,1.8vh,16px) clamp(28px,4vw,44px);
          transition: border-color 0.2s, color 0.2s, transform 0.12s;
        }
        .btn-g:hover  { border-color: var(--ink-faint); color: var(--ink); }
        .btn-g:active { transform: scale(0.97); }

        /* ── STEP SHELL ── */
        .step-shell {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 2px 1fr auto;
        }
        .topbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: clamp(16px,2.5vh,28px) clamp(20px,5vw,56px);
          border-bottom: 1px solid var(--cream-dark);
        }
        .brand { font-size: clamp(13px,2vw,16px); }
        .brand em { font-style: italic; color: var(--gold); }
        .step-meta { display: flex; align-items: center; gap: 14px; }
        .step-dots { display: flex; gap: 7px; }
        .sdot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--cream-dark); transition: background 0.2s;
        }
        .sdot.active { background: var(--gold); }
        .sdot.done   { background: var(--ink-faint); }
        .step-lbl {
          font-family: var(--mono);
          font-size: clamp(8px,1.2vw,10px);
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--ink-faint);
        }

        /* progress bar */
        .pbar { background: var(--cream-dark); height: 2px; }
        .pbar-fill { height: 100%; background: var(--gold); transition: width 0.35s ease; }

        /* ── CARD STAGE ── */
        .stage {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: clamp(16px,3vw,40px) clamp(20px,5vw,56px);
          gap: clamp(16px,2.5vh,28px);
        }
        .stage-headline { text-align: center; }
        .stage-headline h2 {
          font-size: clamp(20px,4vw,36px); font-weight: 300;
          letter-spacing: -0.01em; line-height: 1.15; margin-bottom: 6px;
        }
        .stage-headline h2 em { font-style: italic; color: var(--gold); }
        .stage-headline p {
          font-family: var(--mono);
          font-size: clamp(8px,1.2vw,10px);
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink-faint);
        }

        .card-wrap {
          display: flex; flex-direction: column;
          align-items: center;
          gap: clamp(14px,2vh,22px);
          width: 100%;
        }

        .film-card-sizer {
          height: clamp(220px, 46vh, 420px);
          aspect-ratio: 2/3;
          flex-shrink: 0;
          position: relative;
        }

        .film-card {
          width: 100%; height: 100%;
          border-radius: 4px; overflow: hidden;
          position: relative;
          box-shadow: 0 20px 56px rgba(0,0,0,0.16), 0 4px 14px rgba(0,0,0,0.08);
          user-select: none;
          transition: transform 0.22s ease;
        }
        .film-card:hover { transform: translateY(-3px) scale(1.005); }

        .fc-bg { position: absolute; inset: 0; }
        .fc-info {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: clamp(12px,3%,18px);
        }
        .fc-mood {
          font-family: var(--mono);
          font-size: clamp(7px,1vw,9px);
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.38); line-height: 1.6;
        }
        .fc-title {
          font-family: var(--serif);
          font-size: clamp(18px,3.5vw,28px); font-weight: 400;
          color: #fff; line-height: 1.2; margin-bottom: 4px;
        }
        .fc-dir {
          font-family: var(--mono);
          font-size: clamp(7px,1vw,9px);
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        /* dot trail */
        .f-dots { display: flex; gap: 7px; justify-content: center; }
        .fdot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--cream-dark); transition: background 0.2s, transform 0.2s;
        }
        .fdot.cur     { background: var(--gold); transform: scale(1.4); }
        .fdot.loved   { background: var(--gold-light); }
        .fdot.disliked{ background: var(--ink-faint); }
        .fdot.unseen  { background: var(--cream-dark); outline: 1px solid var(--ink-faint); outline-offset: 1px; }

        /* swipe hint */
        .swipe-hint {
          font-family: var(--mono);
          font-size: 9px; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--ink-faint);
        }

        /* ── REACTION BUTTONS ── */
        .rxn-row {
          display: flex; gap: clamp(8px,1.5vw,12px);
          justify-content: center;
          width: 100%; max-width: 360px;
        }
        .rxn-btn {
          flex: 1; min-width: 80px; max-width: 130px;
          display: flex; flex-direction: column;
          align-items: center; gap: 5px;
          padding: clamp(10px,1.8vh,14px) 8px;
          border-radius: var(--r);
          border: 1.5px solid var(--cream-dark);
          background: transparent; cursor: pointer;
          transition: background 0.17s, border-color 0.17s, transform 0.12s;
        }
        .rxn-icon {
          font-size: clamp(18px,3vw,22px); line-height: 1;
          transition: transform 0.14s;
        }
        .rxn-lbl {
          font-family: var(--mono);
          font-size: clamp(7px,1vw,8px);
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--ink-faint); text-align: center; line-height: 1.45;
        }
        .rxn-btn.loved   { border-color: var(--gold-faint); }
        .rxn-btn.loved:hover   { background: var(--gold); border-color: var(--gold); }
        .rxn-btn.loved:hover .rxn-icon { transform: scale(1.2); color: var(--cream); }
        .rxn-btn.loved:hover .rxn-lbl  { color: rgba(255,255,255,0.75); }
        .rxn-btn.disliked:hover { background: var(--ink); border-color: var(--ink); }
        .rxn-btn.disliked:hover .rxn-lbl, .rxn-btn.disliked:hover .rxn-icon { color: #fff; }
        .rxn-btn.unseen:hover  { background: var(--cream-dark); }
        .rxn-btn:active { transform: scale(0.95); }

        /* ── BOTTOM BAR ── */
        .botbar {
          border-top: 1px solid var(--cream-dark);
          padding: clamp(12px,2vh,20px) clamp(20px,5vw,56px);
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
          flex-wrap: wrap;
        }
        .loved-row { display: flex; align-items: center; gap: 10px; }
        .loved-txt {
          font-family: var(--mono);
          font-size: clamp(8px,1.1vw,10px);
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--ink-faint);
        }
        .botright { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
        .nudge {
          font-family: var(--mono);
          font-size: 8px; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--gold);
        }
        .btn-cont {
          font-family: var(--mono);
          font-size: clamp(9px,1.3vw,11px);
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: clamp(11px,1.7vh,15px) clamp(22px,3vw,36px);
          border: none; cursor: pointer; border-radius: var(--r);
          transition: background 0.2s, transform 0.12s;
        }
        .btn-cont.on  { background: var(--ink); color: var(--cream); }
        .btn-cont.on:hover  { background: var(--gold); }
        .btn-cont.off { background: var(--cream-dark); color: var(--ink-faint); cursor: not-allowed; }

        /* ── PYRAMID CONFIRM ── */
        .pyramid-shell {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; flex-direction: column;
          padding: clamp(28px,5vw,56px) clamp(20px,4vw,48px);
          gap: clamp(20px,3vh,36px);
        }
        .pyr-header {
          display: flex; justify-content: space-between;
          align-items: flex-end; flex-wrap: wrap; gap: 12px;
        }
        .pyr-title {
          font-size: clamp(28px,5vw,52px); font-weight: 300;
          letter-spacing: -0.02em; line-height: 1.05;
        }
        .pyr-title em { font-style: italic; color: var(--gold); }
        .pyr-sub {
          font-family: var(--mono);
          font-size: clamp(8px,1.1vw,10px);
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink-faint); margin-top: 8px;
        }
        .pyr-hint {
          font-family: var(--mono);
          font-size: clamp(8px,1.1vw,10px);
          letter-spacing: 0.13em; text-transform: uppercase;
          color: var(--ink-faint); line-height: 1.85;
          text-align: right;
        }

        /* pyramid rows */
        .pyramid {
          display: flex; flex-direction: column;
          align-items: center;
          gap: clamp(10px,1.8vh,18px);
          flex: 1; justify-content: center;
        }
        .pyr-row {
          display: flex; gap: clamp(10px,1.8vw,18px);
          justify-content: center; align-items: flex-start;
        }

        /* card sizes by row */
        .pyr-card {
          cursor: grab; transition: transform 0.2s, opacity 0.2s;
          position: relative; flex-shrink: 0;
        }
        .pyr-card:active { cursor: grabbing; }
        .pyr-card.drag-src { opacity: 0.28; transform: scale(0.94); }
        .pyr-card.drag-tgt { transform: scale(1.06); outline: 2px solid var(--gold); border-radius: 3px; }

        .pyr-card[data-rank="0"] { width: clamp(130px,16vw,196px); }
        .pyr-card[data-rank="1"],
        .pyr-card[data-rank="2"] { width: clamp(108px,13vw,160px); }
        .pyr-card[data-rank="3"],
        .pyr-card[data-rank="4"] { width: clamp(90px,11vw,132px); }

        .pyr-rank-lbl {
          font-family: var(--mono);
          font-size: clamp(7px,0.9vw,9px);
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold);
          display: flex; align-items: center; gap: 5px;
          margin-bottom: 7px;
        }
        .pyr-rank-lbl::after { content:''; flex:1; height:1px; background: var(--gold-faint); }

        .pyr-poster {
          width: 100%; aspect-ratio: 2/3; border-radius: 3px;
          overflow: hidden; position: relative; margin-bottom: 8px;
        }
        .pyr-poster-inner {
          width: 100%; height: 100%;
          display: flex; align-items: flex-end;
          padding: clamp(8px,2%,14px);
        }
        .pyr-poster-title {
          font-family: var(--serif);
          font-size: clamp(10px,1.4vw,13px);
          color: #fff; line-height: 1.3;
        }
        .pyr-rep {
          position: absolute; bottom:0; left:0; right:0;
          font-family: var(--mono); font-size: 8px;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-align: center; padding: 7px;
          background: rgba(0,0,0,0.76); color: rgba(255,255,255,0.8);
          border: none; cursor: pointer; width: 100%;
          opacity: 0; transition: opacity 0.16s;
        }
        .pyr-card:hover .pyr-rep { opacity: 1; }
        .pyr-name { font-size: clamp(10px,1.3vw,13px); font-weight:400; line-height:1.3; margin-bottom:2px; }
        .pyr-meta { font-family:var(--mono); font-size:clamp(7px,0.9vw,9px); letter-spacing:0.1em; color:var(--ink-faint); text-transform:uppercase; }

        /* empty state */
        .pyr-empty {
          text-align: center; padding: clamp(40px,8vh,80px) 20px;
        }
        .pyr-empty-title {
          font-size: clamp(20px,3vw,32px); font-weight:300; margin-bottom:12px;
        }
        .pyr-empty-title em { font-style:italic; color:var(--gold); }
        .pyr-empty-sub {
          font-family: var(--mono);
          font-size: clamp(9px,1.2vw,11px);
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--ink-faint); line-height: 1.8;
        }

        .pyr-foot { display:flex; flex-direction:column; align-items:center; gap:12px; }
        .pyr-count { font-family:var(--mono); font-size:clamp(8px,1.1vw,10px); letter-spacing:0.22em; text-transform:uppercase; color:var(--ink-faint); }

        /* ── REPLACE OVERLAY ── */
        .rep-overlay {
          position: fixed; inset: 0;
          background: rgba(242,237,227,0.96);
          backdrop-filter: blur(6px);
          z-index: 300;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: clamp(28px,5vw,56px); gap: 0;
        }
        .rep-title { font-size:clamp(26px,5vw,44px); font-weight:300; text-align:center; margin-bottom:8px; }
        .rep-title em { font-style:italic; color:var(--gold); }
        .rep-sub { font-family:var(--mono); font-size:clamp(8px,1.1vw,10px); letter-spacing:0.2em; text-transform:uppercase; color:var(--ink-faint); margin-bottom:clamp(24px,4vh,44px); }
        .rep-grid { display:flex; gap:clamp(10px,2vw,18px); flex-wrap:wrap; justify-content:center; max-width:680px; margin-bottom:clamp(20px,3vh,36px); }
        .rep-card { width:clamp(90px,13vw,130px); cursor:pointer; transition:transform 0.16s; }
        .rep-card:hover { transform:translateY(-3px); }
        .rep-card-poster { width:100%; aspect-ratio:2/3; border-radius:3px; overflow:hidden; margin-bottom:7px; border:2px solid transparent; transition:border-color 0.16s; }
        .rep-card:hover .rep-card-poster { border-color:var(--gold); }
        .rep-ct { font-size:11px; line-height:1.3; margin-bottom:2px; }
        .rep-cy { font-family:var(--mono); font-size:8px; letter-spacing:0.1em; color:var(--ink-faint); text-transform:uppercase; }
        .rep-empty { font-family:var(--mono); font-size:10px; letter-spacing:0.18em; color:var(--ink-faint); text-transform:uppercase; }

        /* ── DONE ── */
        .done {
          position: relative; z-index:1;
          min-height: 100vh;
          display: flex; flex-direction:column;
          align-items:center; justify-content:center;
          text-align:center;
          padding: clamp(40px,8vw,80px) clamp(24px,6vw,60px);
        }
        .done-title { font-size:clamp(36px,8vw,80px); font-weight:300; letter-spacing:-0.025em; line-height:1.05; margin-bottom:18px; animation:au 0.55s 0.08s ease both; }
        .done-title em { font-style:italic; color:var(--gold); }
        .done-body { font-size:clamp(14px,2vw,17px); font-weight:300; color:var(--ink-light); max-width:420px; line-height:1.75; margin-bottom:clamp(36px,5vh,56px); animation:au 0.55s 0.16s ease both; }
        .done-thumbs { display:flex; gap:clamp(8px,1.5vw,12px); justify-content:center; margin-bottom:clamp(36px,5vh,56px); animation:au 0.55s 0.24s ease both; }
        .done-thumb { width:clamp(52px,7vw,72px); aspect-ratio:2/3; border-radius:3px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.1); }

        /* ── COMPLETION CARD ── */
        .done-card-sizer {
          height: clamp(220px, 46vh, 420px);
          aspect-ratio: 2/3;
          flex-shrink: 0;
          animation: au 0.4s ease both;
        }
        .done-card {
          width: 100%; height: 100%;
          border-radius: 4px;
          border: 1.5px solid var(--cream-dark);
          background: rgba(242,237,227,0.4);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }
        .done-card-check {
          font-size: clamp(32px,5vw,48px);
          color: var(--gold);
          line-height: 1;
          animation: checkPop 0.4s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .done-card-label {
          font-family: var(--mono);
          font-size: clamp(8px,1.1vw,10px);
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--ink-faint); text-align: center;
          line-height: 1.8;
        }
        @keyframes checkPop {
          from { opacity:0; transform: scale(0.4); }
          to   { opacity:1; transform: scale(1); }
        }

        /* ── NAV ARROWS ── */
        .nav-arrows {
          display: flex; align-items: center;
          justify-content: space-between;
          width: 100%; max-width: 420px;
          padding: 0 4px;
        }
        .nav-arrow {
          width: clamp(36px,5vw,44px);
          height: clamp(36px,5vw,44px);
          border-radius: 50%;
          border: 1.5px solid var(--cream-dark);
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: clamp(14px,2vw,18px);
          color: var(--ink-light);
          transition: border-color 0.18s, background 0.18s, color 0.18s, transform 0.12s, opacity 0.18s;
          flex-shrink: 0;
        }
        .nav-arrow:hover:not(:disabled) {
          border-color: var(--gold);
          background: var(--gold-faint);
          color: var(--gold);
        }
        .nav-arrow:active:not(:disabled) { transform: scale(0.93); }
        .nav-arrow:disabled { opacity: 0.22; cursor: not-allowed; }
        .nav-center { flex: 1; display: flex; justify-content: center; }

        /* ── ANIMATIONS ── */
        @keyframes au {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:none; }
        }
        .au0 { animation: au 0.5s ease both; }
        .au1 { animation: au 0.5s 0.08s ease both; }
        .au2 { animation: au 0.5s 0.16s ease both; }
        .au3 { animation: au 0.5s 0.24s ease both; }
      `}</style>

      <div className={`root${!fadeIn ? " faded" : ""}`}>

        {/* ══ WELCOME ══ */}
        {phase === "welcome" && (
          <div className="welcome">
            <div className="eyebrow">Semantic Sphere · Onboarding</div>
            <h1 className="w-title">I tuoi<br /><em>pilastri</em><br />del gusto</h1>
            <div className="divider" />
            <p className="w-sub">Ogni film che ami è una porta.<br />Mostraci le tue porte.</p>
            <p className="w-desc">
              Ti mostreremo 15 film in tre gruppi.<br />
              Dicci cosa ami, cosa non fa per te,<br />
              cosa non hai ancora visto.
            </p>
            <button className="btn-p" onClick={() => pageTransition(() => setPhase("step"))}>
              Inizia →
            </button>
          </div>
        )}

        {/* ══ STEP ══ */}
        {phase === "step" && (
          <div className="step-shell">

            {/* topbar */}
            <div className="topbar">
              <div className="brand">La <em>Sfera</em> Semantica</div>
              <div className="step-meta">
                <div className="step-dots">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`sdot ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`} />
                  ))}
                </div>
                <div className="step-lbl">Gruppo {currentStep + 1}/{STEPS.length}</div>
              </div>
            </div>

            {/* progress bar */}
            <div className="pbar">
              <div className="pbar-fill" style={{ width: stepDone ? "100%" : `${progressPct}%` }} />
            </div>

            {/* card stage */}
            <div className="stage">
              <div className="stage-headline au0">
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

              <div className="card-wrap">
                {/* ── completion card ── */}
                {stepDone ? (
                  <div className="done-card-sizer">
                    <div className="done-card">
                      <div className="done-card-check">✓</div>
                      <div className="done-card-label">
                        tutti i film<br />valutati
                      </div>
                    </div>
                  </div>
                ) : currentFilm ? (
                  <>
                    {/* film card */}
                    <div className="film-card-sizer" style={cardStyle.style}>
                      <div
                        className="film-card"
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                      >
                        <div
                          className="fc-bg"
                          style={{ background: `linear-gradient(155deg, ${currentFilm.color} 0%, ${currentFilm.accent}60 55%, ${currentFilm.color}EE 100%)` }}
                        />
                        <div className="fc-info">
                          <div className="fc-mood">{currentFilm.mood}</div>
                          <div>
                            <div className="fc-title">{currentFilm.title}</div>
                            <div className="fc-dir">{currentFilm.director} · {currentFilm.year}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* swipe hint mobile */}
                    {isMobile && <div className="swipe-hint">swipe per valutare · frecce per navigare</div>}
                  </>
                ) : null}

                {/* nav arrows + dot trail — always visible */}
                <div className="nav-arrows">
                  <button
                    className="nav-arrow"
                    disabled={!stepDone && filmIndex === 0}
                    onClick={() => stepDone ? navigateTo(stepFilms.length - 1) : navigateTo(filmIndex - 1)}
                    title="Film precedente"
                  >
                    ←
                  </button>
                  <div className="nav-center">
                    <div className="f-dots">
                      {stepFilms.map((f, i) => {
                        const r = reactions[f.id];
                        const isCur = !stepDone && i === filmIndex;
                        const cls = isCur ? "cur" : r === "loved" ? "loved" : r === "disliked" ? "disliked" : r === "unseen" ? "unseen" : "";
                        return (
                          <div
                            key={f.id}
                            className={`fdot ${cls}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigateTo(i)}
                            title={f.title}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <button
                    className="nav-arrow"
                    disabled={!stepDone && filmIndex === stepFilms.length - 1}
                    onClick={() => navigateTo(filmIndex + 1)}
                    title="Film successivo"
                  >
                    →
                  </button>
                </div>

                {/* reaction buttons — hidden when step is done */}
                {!stepDone && (
                  <div className="rxn-row au1">
                    <button className="rxn-btn loved" onClick={() => handleReaction("loved")}>
                      <span className="rxn-icon" style={{ color: "var(--gold)" }}>♥</span>
                      <span className="rxn-lbl">L'ho<br />amato</span>
                    </button>
                    <button className="rxn-btn disliked" onClick={() => handleReaction("disliked")}>
                      <span className="rxn-icon" style={{ color: "var(--ink-light)" }}>✕</span>
                      <span className="rxn-lbl">Non fa<br />per me</span>
                    </button>
                    <button className="rxn-btn unseen" onClick={() => handleReaction("unseen")}>
                      <span className="rxn-icon" style={{ color: "var(--ink-faint)" }}>○</span>
                      <span className="rxn-lbl">Non l'ho<br />visto</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* bottom bar */}
            <div className="botbar">
              <div className="loved-row">
                <div className="loved-txt">
                  {stepFilms.filter(f => reactions[f.id] === "loved").length > 0
                    ? `${stepFilms.filter(f => reactions[f.id] === "loved").length} ♥ in questo gruppo`
                    : "nessun film amato ancora"}
                </div>
              </div>
              <div className="botright">
                {!stepDone && !allReacted && (
                  <div className="nudge">valuta tutti i film per continuare</div>
                )}
                <button
                  className={`btn-cont ${canGoNext || stepDone ? "on" : "off"}`}
                  disabled={!canGoNext && !stepDone}
                  onClick={handleNextStep}
                >
                  {isLastStep ? "Vedi il riepilogo →" : "Prossimo gruppo →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ CONFIRM — PYRAMID ══ */}
        {phase === "confirm" && (() => {
          // pyramid layout: row0=[0], row1=[1,2], row2=[3,4]
          const rows = [
            pillars.slice(0, 1),
            pillars.slice(1, 3),
            pillars.slice(3, 5),
          ].filter(r => r.length > 0);

          return (
            <div className="pyramid-shell">
              {replacingPillar !== null && (
                <div className="rep-overlay">
                  <h3 className="rep-title">Scegli il <em>sostituto</em></h3>
                  <div className="rep-sub">Film che hai amato · non ancora nei pilastri</div>
                  <div className="rep-grid">
                    {replacementCandidates.length === 0
                      ? <p className="rep-empty">Nessun candidato disponibile</p>
                      : replacementCandidates.map(film => (
                        <div key={film.id} className="rep-card" onClick={() => handleReplace(replacingPillar, film)}>
                          <div className="rep-card-poster">
                            <div style={{ background: `linear-gradient(155deg,${film.color},${film.accent}66)`, width: "100%", height: "100%", display: "flex", alignItems: "flex-end", padding: "10px 8px" }}>
                              <span style={{ fontFamily: "var(--serif)", fontSize: "11px", color: "#fff", lineHeight: 1.3 }}>{film.title}</span>
                            </div>
                          </div>
                          <div className="rep-ct">{film.title}</div>
                          <div className="rep-cy">{film.year}</div>
                        </div>
                      ))
                    }
                  </div>
                  <button className="btn-g" onClick={() => setReplacingPillar(null)}>Annulla</button>
                </div>
              )}

              <div className="pyr-header au0">
                <div>
                  <h2 className="pyr-title">Il tuo<br /><em>profilo</em></h2>
                  <div className="pyr-sub">Trascina per riordinare · hover per sostituire</div>
                </div>
                <div className="pyr-hint">
                  Il vertice è<br />il tuo centro.<br />L'ordine conta.
                </div>
              </div>

              {pillars.length === 0 ? (
                <div className="pyr-empty au1">
                  <div className="pyr-empty-title">Nessun film <em>amato</em></div>
                  <div className="pyr-empty-sub">
                    Torna indietro e seleziona<br />almeno un film che ti ha colpito.
                  </div>
                </div>
              ) : (
                <div className="pyramid au1">
                  {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="pyr-row">
                      {row.map((film) => {
                        const globalIdx = pillars.indexOf(film);
                        return (
                          <div
                            key={film.id}
                            className={`pyr-card ${dragItem === globalIdx ? "drag-src" : ""} ${dragOver === globalIdx ? "drag-tgt" : ""}`}
                            data-rank={globalIdx}
                            draggable
                            onDragStart={() => onDragStart(globalIdx)}
                            onDragEnter={() => onDragEnter(globalIdx)}
                            onDragEnd={onDragEnd}
                            onDragOver={e => e.preventDefault()}
                          >
                            <div className="pyr-rank-lbl">
                              {globalIdx === 0 ? "▲ vertice" : `n° ${globalIdx + 1}`}
                            </div>
                            <div className="pyr-poster">
                              <div
                                className="pyr-poster-inner"
                                style={{ background: `linear-gradient(155deg,${film.color} 0%,${film.accent}66 70%,${film.color} 100%)` }}
                              >
                                <span className="pyr-poster-title">{film.title}</span>
                              </div>
                              <button className="pyr-rep" onClick={() => setReplacingPillar(globalIdx)}>↔ Sostituisci</button>
                            </div>
                            <div className="pyr-name">{film.title}</div>
                            <div className="pyr-meta">{film.director} · {film.year}</div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              <div className="pyr-foot au2">
                <div className="pyr-count">
                  {pillars.length} {pillars.length === 1 ? "pilastro" : "pilastri"} · pronto per la sfera
                </div>
                <button className="btn-p" onClick={() => pageTransition(() => setPhase("done"))}>
                  Entra nella Sfera →
                </button>
              </div>
            </div>
          );
        })()}

        {/* ══ DONE ══ */}
        {phase === "done" && (
          <div className="done">
            <div className="eyebrow au0">Onboarding completato</div>
            <h2 className="done-title">La tua <em>Sfera</em><br />è pronta</h2>
            <p className="done-body">
              I tuoi {pillars.length} pilastri del gusto sono stati registrati.
              Il grafo editoriale costruirà attorno a loro una costellazione di film
              connessi da fili invisibili ma precisi.
            </p>
            <div className="done-thumbs">
              {pillars.map(film => (
                <div key={film.id} className="done-thumb">
                  <div style={{ background: `linear-gradient(155deg,${film.color},${film.accent}55)`, width: "100%", height: "100%" }} />
                </div>
              ))}
            </div>
            <button
              className="btn-p"
              onClick={() => pageTransition(() => {
                setPhase("welcome"); setReactions({});
                setCurrentStep(0); setFilmIndex(0); setPillars([]); setStepDone(false);
              })}
            >
              ↺ Ricomincia la simulazione
            </button>
          </div>
        )}

      </div>
    </>
  );
}