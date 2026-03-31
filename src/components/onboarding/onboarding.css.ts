/* ═══════════════════════════════════════════════════════════════════
   CSS — prefixed with 'ob-' to avoid class collisions with the rest
   of the app. Ported from beta1.jsx with minimal changes.
   ═══════════════════════════════════════════════════════════════════ */
export const ONBOARDING_CSS = `
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
  padding-top: calc(clamp(40px, 5vh, 60px) + env(safe-area-inset-top, 0px));
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

/* ── PYRAMID HINT ── */
.ob-pyr-hint {
  font-family: var(--ob-mono);
  font-size: clamp(8px, 1.1vw, 10px);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ob-ink-faint);
  text-align: center;
  margin-top: clamp(16px, 3vh, 28px);
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}

/* ── CONFIRM FOOTER SECTION ── */
.ob-conf-footer-section {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  padding-bottom: env(safe-area-inset-top, 20px);
}

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
  display: flex; align-items: center; justify-content: center; position: relative;
  height: clamp(54px, 7vh, 80px);
  padding: 12px;
  border-radius: var(--ob-r);
  border: 1px solid var(--ob-cream-dark);
  background: transparent; cursor: pointer;
  transition: all 0.2s ease;
}
.ob-streaming-logo {
  height: 100%; width: auto; max-width: 100%;
  object-fit: contain;
  opacity: 0.85;
}
.ob-streaming-btn.active .ob-streaming-logo {
  opacity: 1; filter: drop-shadow(0 0 2px rgba(255,255,255,0.4));
}
.ob-streaming-name {
  font-family: var(--ob-mono);
  font-size: clamp(8px, 1.2vw, 10px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ob-ink-light);
}
.ob-streaming-btn:hover {
  border-color: var(--ob-gold-faint);
  background: var(--ob-gold-faint);
}
.ob-streaming-btn.active {
  background: var(--ob-ink-light);
  border-color: var(--ob-ink);
  color: var(--ob-cream);
}
.ob-streaming-btn:active { transform: scale(0.96); }
`;
