/**
 * AppLoader — splash screen animato per NoZapp
 *
 * Uso in app/layout.tsx:
 *   import AppLoader from '@/components/AppLoader';
 *   ...
 *   <body>
 *     <AppLoader />
 *     {children}
 *   </body>
 *
 * Il loader scompare dopo 1.4s con un fade da CSS puro.
 * Non richiede JS per funzionare — animazioni via @keyframes.
 */

export default function AppLoader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        #nz-loader {
          position: fixed; inset: 0; z-index: 9999;
          background: #F2EDE3;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 36px;
          animation: nzLoaderOut 0.45s ease 1.2s forwards;
          pointer-events: none;
        }
        @keyframes nzLoaderOut {
          to { opacity: 0; visibility: hidden; }
        }

        /* Tre anelli orbitali — una per shell */
        .nzl-orbit { position: relative; width: 110px; height: 110px; }
        .nzl-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid transparent;
          top: 50%; left: 50%;
        }
        .nzl-ring-0 {
          width: 32px; height: 32px; margin: -16px 0 0 -16px;
          border-color: rgba(120,39,46,0.4);
          border-top-color: #78272e;
          animation: nzSpin 1.1s linear infinite;
        }
        .nzl-ring-1 {
          width: 64px; height: 64px; margin: -32px 0 0 -32px;
          border-color: rgba(181,140,42,0.2);
          border-top-color: #b58c2a;
          border-right-color: rgba(181,140,42,0.4);
          animation: nzSpin 1.8s linear infinite reverse;
        }
        .nzl-ring-2 {
          width: 104px; height: 104px; margin: -52px 0 0 -52px;
          border-color: rgba(59,139,158,0.12);
          border-top-color: #3b8b9e;
          animation: nzSpin 3.2s linear infinite;
        }
        .nzl-dot {
          position: absolute; width: 6px; height: 6px;
          background: #78272e; border-radius: 50%;
          top: 50%; left: 50%; margin: -3px 0 0 -3px;
          animation: nzPulse 2s ease-in-out infinite;
        }
        @keyframes nzSpin  { to { transform: rotate(360deg); } }
        @keyframes nzPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(1.7); }
        }

        /* Wordmark con reveal lettera per lettera */
        .nzl-text { display: flex; flex-direction: column; align-items: center; gap: 9px; }
        .nzl-wordmark {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 36px; font-weight: 300;
          letter-spacing: 0.06em; color: #1A1614;
          display: flex; align-items: baseline;
        }
        .nzl-wordmark em { font-style: italic; color: #b58c2a; }
        .nzl-wordmark span {
          display: inline-block;
          animation: nzChar 0.38s ease both;
        }
        /* No · Z · a · p · p */
        .nzl-wordmark span:nth-child(1) { animation-delay: 0.05s; }
        .nzl-wordmark span:nth-child(2) { animation-delay: 0.13s; }
        .nzl-wordmark span:nth-child(3) { animation-delay: 0.21s; }
        .nzl-wordmark span:nth-child(4) { animation-delay: 0.29s; }
        .nzl-wordmark span:nth-child(5) { animation-delay: 0.37s; }
        .nzl-wordmark span:nth-child(6) { animation-delay: 0.45s; }
        @keyframes nzChar {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }

        .nzl-sub {
          font-family: 'Fragment Mono', 'Courier Prime', monospace;
          font-size: 9px; letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(181,140,42,0.65);
          animation: nzFadeUp 0.4s 0.7s ease both;
          opacity: 0;
        }
        @keyframes nzFadeUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: none; }
        }
      `}} />

      <div id="nz-loader">
        <div className="nzl-orbit">
          <div className="nzl-ring nzl-ring-2" />
          <div className="nzl-ring nzl-ring-1" />
          <div className="nzl-ring nzl-ring-0" />
          <div className="nzl-dot" />
        </div>
        <div className="nzl-text">
          <div className="nzl-wordmark">
            {'No'.split('').map((c, i) => (
              <span key={i}>{c}</span>
            ))}
            <em>
              {'Zapp'.split('').map((c, i) => (
                <span key={i + 2}>{c}</span>
              ))}
            </em>
          </div>
          <div className="nzl-sub">la sfera semantica</div>
        </div>
      </div>
    </>
  );
}
