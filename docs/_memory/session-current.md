---
date: 2026-03-27
status: active
---

## [15:40] feature / refactor

**File toccati**:
- `src/components/layout/AppLoader.tsx` — [Nuovo] Splash screen orbitale con anelli ember/gold/cold.
- `public/manifest.json` — Aggiornamento PWA v2.0 con modalità fullscreen e shortcuts.
- `src/app/layout.tsx` — Integrazione `AppLoader` e aggiornamento metadati viewport.
- `src/components/ui/SplashScreen.tsx` — [Eliminato] Vecchio splash screen di base.

**Problema di partenza**: Necessità di un'esperienza di apertura app premium e configurazione PWA professionale (fullscreen, shortcuts).
**Soluzione applicata**: Migrata la soluzione sviluppata in sandbox nel progetto principale. Implementato `AppLoader` con animazioni CSS pure per caricamento istantaneo e sincronizzato il manifest PWA.
**Side effects**: Migliorata la velocità di percezione del caricamento.

---
