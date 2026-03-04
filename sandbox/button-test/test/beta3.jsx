import { useState, useRef } from "react";

// ─── Film strip constants ──────────────────────────────────────────────────
const FW = 28;   // frame width px
const BH = 46;   // button height px
const HB = 9;    // hole-band height (top + bottom)
const HW = 5;    // sprocket hole width
const HH = 5.5;  // sprocket hole height
const NF = 36;   // total frames rendered (2× for seamless loop)
const HALF = (NF / 2) * FW;  // 504 — animation translateX target

// Frame color variants
const FRAME_FILLS = [
  "rgb(18, 6, 9)",
  "rgb(24, 9, 12)",
  "rgb(20, 7, 10)",
];

// ─── Styles ───────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:   rgb(248, 248, 238);
    --ink:  rgb(22, 10, 12);
    --r1:   rgb(73,  17, 24);
    --r3:   rgb(120, 39, 46);
    --cream: rgb(248, 248, 238);
  }

  body {
    background: var(--bg);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
  }

  /* paper lines */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: repeating-linear-gradient(
      0deg, transparent, transparent 28px,
      rgba(22,10,12,0.018) 28px, rgba(22,10,12,0.018) 29px
    );
    pointer-events: none;
  }

  /* ── Film roll keyframe ──────────────────────────────────────────────── */
  @keyframes filmRoll {
    from { transform: translateX(0); }
    to   { transform: translateX(-${HALF}px); }
  }

  /* ── Text morph out ──────────────────────────────────────────────────── */
  @keyframes textOut {
    0%   { opacity: 1; transform: scaleX(1);   filter: blur(0px);  }
    100% { opacity: 0; transform: scaleX(0.2); filter: blur(3px);  }
  }

  /* ── Strip unroll from center ────────────────────────────────────────── */
  @keyframes stripIn {
    0%   { clip-path: inset(0 50% 0 50% round 2px); opacity: 0.6; }
    60%  { opacity: 1; }
    100% { clip-path: inset(0 0%  0 0%  round 2px); opacity: 1;   }
  }

  /* ── Strip roll back to center (on done) ─────────────────────────────── */
  @keyframes stripOut {
    0%   { clip-path: inset(0 0%  0 0%  round 2px); opacity: 1; }
    100% { clip-path: inset(0 50% 0 50% round 2px); opacity: 0; }
  }

  /* ── Demo wrapper ────────────────────────────────────────────────────── */
  .demo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    padding: 48px 24px;
  }
  .demo-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: var(--ink);
    letter-spacing: 0.02em;
  }
  .demo-sub {
    font-size: 0.68rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(22,10,12,0.3);
    margin-top: 6px;
    text-align: center;
  }
  .demo-buttons {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 100%;
    max-width: 320px;
  }
  .demo-status {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(22,10,12,0.3);
    min-height: 1em;
    transition: opacity 0.3s;
  }

  /* ── THE BUTTON ──────────────────────────────────────────────────────── */
  .film-btn {
    position: relative;
    width: 100%;
    height: ${BH}px;
    background: linear-gradient(135deg, var(--r3) 0%, var(--r1) 100%);
    border: none;
    border-radius: 2px;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 3px 14px rgba(73,17,24,0.26);
    transition: box-shadow 0.25s, transform 0.15s;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  .film-btn:hover:not([disabled]) {
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(73,17,24,0.38);
  }
  .film-btn[disabled] { cursor: default; }

  /* ── Text layer ──────────────────────────────────────────────────────── */
  .btn-text {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--cream);
    transform-origin: center;
    will-change: transform, opacity, filter;
    transition: none;
    pointer-events: none;
  }
  /* text hidden during loading/done */
  .btn-text.out {
    animation: textOut 0.26s cubic-bezier(0.55, 0, 0.8, 0.45) forwards;
  }
  .btn-text.gone {
    opacity: 0;
    transform: scaleX(0.2);
    filter: blur(3px);
    pointer-events: none;
  }

  /* ── Film strip layer ────────────────────────────────────────────────── */
  .film-layer {
    position: absolute; inset: 0;
    clip-path: inset(0 50% 0 50% round 2px);
    opacity: 0;
    will-change: clip-path, opacity;
    pointer-events: none;
    overflow: hidden;
  }
  .film-layer.unrolling {
    animation: stripIn 0.48s cubic-bezier(0.16, 1, 0.3, 1) 0.14s both;
  }
  .film-layer.rolling {
    clip-path: inset(0 0% 0 0% round 2px);
    opacity: 1;
  }
  .film-layer.rewinding {
    animation: stripOut 0.38s cubic-bezier(0.55, 0, 1, 0.45) forwards;
  }

  /* ── Film track (the scrolling <g> wrapper) ──────────────────────────── */
  .film-track {
    will-change: transform;
  }
  .film-track.rolling {
    animation: filmRoll ${(HALF / 160).toFixed(2)}s linear infinite;
  }
`;

// ─── One film frame ────────────────────────────────────────────────────────
function Frame({ x, i }) {
  const fill = FRAME_FILLS[i % FRAME_FILLS.length];
  const hx = (FW - HW) / 2;
  const hyT = (HB - HH) / 2;
  const hyB = BH - HB + (HB - HH) / 2;
  const inner_y = HB;
  const inner_h = BH - HB * 2;

  return (
    <g transform={`translate(${x},0)`}>
      {/* frame body */}
      <rect width={FW - 0.5} height={BH} fill={fill} />
      {/* inner frame area — very subtly lighter */}
      <rect x={2} y={inner_y} width={FW - 4} height={inner_h}
        fill="rgba(255,255,255,0.025)" />
      {/* subtle grain lines inside frame */}
      {i % 4 === 0 && (
        <rect x={4} y={inner_y + inner_h * 0.35} width={FW - 8} height={0.5}
          fill="rgba(255,255,255,0.04)" />
      )}
      {/* top sprocket hole */}
      <rect x={hx} y={hyT} width={HW} height={HH} rx="0.9"
        fill="rgb(248,248,238)" />
      {/* bottom sprocket hole */}
      <rect x={hx} y={hyB} width={HW} height={HH} rx="0.9"
        fill="rgb(248,248,238)" />
      {/* frame separator (right edge) */}
      <rect x={FW - 0.5} width={0.5} height={BH}
        fill="rgba(248,248,238,0.04)" />
    </g>
  );
}

// ─── Film strip SVG ────────────────────────────────────────────────────────
function FilmStrip({ width, rolling, uid }) {
  const clipId = `fc-${uid}`;
  const frames = Array.from({ length: NF }, (_, i) => i);

  return (
    <svg
      width={width}
      height={BH}
      style={{ display: "block", position: "absolute", inset: 0 }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width={width} height={BH} rx="2" />
        </clipPath>
        {/* subtle vignette overlay */}
        <linearGradient id={`vg-${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgb(73,17,24)" stopOpacity="0.5" />
          <stop offset="12%" stopColor="rgb(73,17,24)" stopOpacity="0" />
          <stop offset="88%" stopColor="rgb(73,17,24)" stopOpacity="0" />
          <stop offset="100%" stopColor="rgb(73,17,24)" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* scrolling film track */}
        <g className={`film-track${rolling ? " rolling" : ""}`}>
          {frames.map(i => (
            <Frame key={i} x={i * FW} i={i} />
          ))}
        </g>

        {/* vignette on left/right edges */}
        <rect width={width} height={BH}
          fill={`url(#vg-${uid})`}
          style={{ pointerEvents: "none" }} />

        {/* top and bottom hole bands overlay — darkens edge strips for readability */}
        <rect width={width} height={HB}
          fill="rgba(0,0,0,0.15)" />
        <rect y={BH - HB} width={width} height={HB}
          fill="rgba(0,0,0,0.15)" />
      </g>
    </svg>
  );
}

// ─── Film Button ───────────────────────────────────────────────────────────
// phase: idle → morphing → loading → done → idle
function FilmButton({ label, onPress, uid }) {
  const [phase, setPhase] = useState("idle");
  const phaseRef = useRef("idle");

  const go = (p) => { phaseRef.current = p; setPhase(p); };

  const handleClick = async () => {
    if (phaseRef.current !== "idle") return;
    go("morphing");

    // Kick off the "real" async call immediately
    const asyncDone = onPress(); // returns a Promise

    // After morph animations settle (~0.14 + 0.48 = 0.62s), switch to loading loop
    const morphTimer = setTimeout(() => {
      if (phaseRef.current === "morphing") go("loading");
    }, 640);

    // When async resolves → done phase → reset
    asyncDone.then(() => {
      clearTimeout(morphTimer);
      go("done");
      setTimeout(() => go("idle"), 480);
    });
  };

  const textCls = [
    "btn-text",
    phase === "morphing" ? "out" : "",
    phase === "loading" || phase === "done" ? "gone" : "",
  ].filter(Boolean).join(" ");

  const filmCls = [
    "film-layer",
    phase === "morphing" ? "unrolling" : "",
    phase === "loading" ? "rolling" : "",
    phase === "done" ? "rewinding" : "",
  ].filter(Boolean).join(" ");

  return (
    <button
      className="film-btn"
      onClick={handleClick}
      disabled={phase !== "idle"}
    >
      <span className={textCls}>{label}</span>
      <div className={filmCls}>
        <FilmStrip
          width={320}
          rolling={phase === "loading" || phase === "done"}
          uid={uid}
        />
      </div>
    </button>
  );
}

// ─── Demo page ─────────────────────────────────────────────────────────────
// Simulates a 2.8s Supabase call
function fakeSupabase() {
  return new Promise(res => setTimeout(res, 2800));
}

export default function FilmButtonDemo() {
  const [loginStatus, setLoginStatus] = useState("idle");
  const [signupStatus, setSignupStatus] = useState("idle");

  const makeHandler = (setter) => async () => {
    setter("loading");
    await fakeSupabase();
    setter("done");
    setTimeout(() => setter("idle"), 600);
  };

  const statusLabel = (s) =>
    s === "idle" ? "click per animare" :
      s === "loading" ? "⏳  in attesa di supabase..." :
        "✓  redirect in corso";

  return (
    <>
      <style>{styles}</style>
      <div className="demo">
        <div style={{ textAlign: "center" }}>
          <div className="demo-title">Film Button</div>
          <div className="demo-sub">preview animazione pellicola</div>
        </div>

        <div className="demo-buttons">
          <FilmButton
            label="Entra nella Sfera"
            onPress={makeHandler(setLoginStatus)}
            uid="login"
          />
          <div className="demo-status">{statusLabel(loginStatus)}</div>

          <div style={{ width: "100%", height: 1, background: "rgba(22,10,12,0.08)", margin: "4px 0" }} />

          <FilmButton
            label="Crea Account"
            onPress={makeHandler(setSignupStatus)}
            uid="signup"
          />
          <div className="demo-status">{statusLabel(signupStatus)}</div>
        </div>

        <div className="demo-sub" style={{ maxWidth: 280, lineHeight: 1.7 }}>
          Il testo fa morph nella pellicola,
          che si svolge dal centro verso i bordi.
          Scorre finché Supabase risponde,
          poi si richiude.
        </div>
      </div>
    </>
  );
}