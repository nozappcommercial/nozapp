---
date: 2026-03-30
status: active
---

## 18:45 [tipo: config | documentation]

**File toccati**:
- `docs/_memory/chat-history/2026-03-30/1509-onboarding-ui.md` — [NEW] Riassunto sessione precedente onboarding.
- `docs/_memory/chat-history/2026-03-30/1816-missing-history.md` — [NEW] Riassunto sessione corrente su recupero log.
- `docs/progetto.md` — Aggiornato indice con i link alla memoria delle sessioni.

**Problema di partenza**: L'utente non vedeva la cronologia chat nell'interfaccia di Antigravity.
**Soluzione applicata**: Creata un'apposita cartella in `_memory` per archiviare localmente in formato Markdown i riassunti delle sessioni odierne, garantendo la persistenza delle decisioni prese.
**Side effects**: Nessuno.

---

## 18:55 [tipo: feature | refactor]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Fix completo onboarding: 4 macro-interventi applicati

**Problema di partenza**: L'onboarding presentava 4 bug su mobile: (1) banda bianca + font errato, (2) 4 bottoni reazione invece di 3, (3) bottone "Prossimo Gruppo" troppo grande, (4) pagina conferma con sidebar/bottom-sheet non ottimale.

**Soluzione applicata**:
1. **Font**: rimappato `--ob-serif` su Cormorant Garamond e `--ob-mono` su Fragment Mono (già caricati via Google Fonts in sphere.css). Cambiato `height: 100dvh` → `min-height: 100dvh` e rimosso `overflow: hidden` su `.ob-root`.
2. **Bottoni**: eliminato il vecchio split-button (Visto/Non Visto) e creato un terzo bottone uniforme con linea diagonale decorativa. Click alterna tra "Non l'ho visto" ↔ "Visto".
3. **Prossimo Gruppo**: ridotto padding e font-size di `.ob-btn-cont`.
4. **Confirm page**: riscritta come pagina scrollabile con 3 sezioni: Hero (100vh con freccia ↓), Piramide (IntersectionObserver fade-in), Film extra (se lovedFilms > 6). Eliminati sidebar toggle, bottom sheet, backdrop blur. Sostituzione via modale overlay o click-click swap.

**Side effects**: Nessuno. Il componente è autocontenuto, il CSS è prefissato `ob-`.

