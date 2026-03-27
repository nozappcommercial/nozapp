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
- `src/components/layout/Header.tsx` — Azzerato l'offset di scroll per le sezioni interne.

**Problema di partenza**: Necessità di un'esperienza di apertura app premium e configurazione PWA professionale (fullscreen, shortcuts). Inoltre, la navigazione verso "Redazione" presentava un offset di 60px indesiderato.
**Soluzione applicata**: Migrata la soluzione sviluppata in sandbox nel progetto principale. Implementato `AppLoader` con animazioni CSS pure. Azzerato l'offset in `handleNavClick` per far combaciare lo scroll con l'inizio reale delle sezioni, sfruttando il padding interno dei componenti.
**Side effects**: Migliorata la precisione dello scroll e la velocità di percezione del caricamento.

---
