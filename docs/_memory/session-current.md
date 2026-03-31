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

---

## 19:08 [tipo: bug-fix | refactor]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Fix 3 problemi visivi su mobile

**Problema di partenza**: (1) Completion card troppo grande con spazio vuoto sotto, (2) pagina piramide non entra in uno schermo + manca snap scroll, (3) bottoni streaming senza stile (testo collassato).

**Soluzione applicata**:
1. **Completion card**: ridotta da `45vw` a `28vw`, aggiunto summary "X amati · Y scartati · Z altri".
2. **Snap scroll + piramide compatta**: scroll-snap-type su `.ob-confirm-scroll`, snap-align sulle sezioni. Card piramide ridotte (~25vw mobile). Rimossa la scritta "Il vertice è il tuo centro". `.ob-step-shell` ora usa `min-height: 100dvh`.
3. **Streaming grid**: aggiunto CSS completo per `.ob-streaming-grid` (griglia 3 colonne), `.ob-streaming-btn` (pillole con check cerchio) e `.ob-streaming-check` con stato attivo scuro.

**Side effects**: Nessuno.

---

## 19:19 [tipo: bug-fix]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Ingrandita completion card

**Problema di partenza**: La card "tutti i film valutati" era troppo piccola su mobile.
**Soluzione applicata**: Width da `clamp(100px, 28vw, 160px)` → `clamp(120px, 38vw, 200px)`. Frecce e pallini restano invariati.
**Side effects**: Nessuno.

---

## 19:30 [tipo: bug-fix]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Fix bottom bar + titolo piramide

**Problema di partenza**: (1) La bottom bar con "nessun film amato" e il bottone saliva invece di restare ancorata in fondo. (2) Il titolo "I tuoi pilastri" era spezzato su due righe.
**Soluzione applicata**: (1) `.ob-step-shell` torna a `height: 100dvh` (non `min-height`) perché la griglia CSS necessita di un'altezza fissa per ancorare l'ultima riga in fondo. (2) Rimosso `<br />` dal titolo → "I tuoi *pilastri*" su una riga.
**Side effects**: Nessuno.

---

## 09:35 [tipo: bug-fix]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Fix overflow orizzontale su tutta la pagina onboarding (confirm + extra films)

**Problema di partenza**: La pagina onboarding (fase confirm) permetteva di scrollare orizzontalmente, mostrando spazio vuoto a destra. Visibile sia nella sezione piramide che in "Altri film amati".

**Soluzione applicata**:
1. **`.ob-root`**: aggiunto `overflow-x: hidden`, `width: 100%`, `max-width: 100vw` per bloccare qualsiasi overflow orizzontale a livello radice.
2. **`.ob-confirm-scroll`**: aggiunto `overflow-x: hidden` e `width: 100%`.
3. **`.ob-conf-section`**: aggiunto `overflow-x: hidden`, `width: 100%`, `box-sizing: border-box`.
4. **`.ob-pyr-row`**: aggiunto `overflow: hidden` e `flex-wrap: wrap` per evitare che le card escano dal contenitore.
5. **`.ob-pyr-card`**: rimosso `flex-shrink: 0` (che forzava dimensioni fisse), aggiunto `min-width: 0`.
6. **`.ob-extra-grid`**: cambiato da `repeat(auto-fill, minmax(110px, 1fr))` a `repeat(3, 1fr)` con padding laterale e `box-sizing: border-box`. Griglia fissa a 3 colonne (2 sotto 360px).
7. **`.ob-extra-title` / `.ob-extra-sub`**: aggiunto padding laterale, `text-align: center`, `width: 100%`, `box-sizing: border-box`.

**Side effects**: Nessuno. Tutte le classi sono prefissate `ob-`.

---

## 10:20 [tipo: bug-fix | refactor]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Footer "Prosegui" integrato nella sezione + fix padding top piramide

**Problema di partenza**: (1) Il bottone "Prosegui →" e il contatore pilastri erano visibili solo con uno scroll aggiuntivo dopo la sezione "Altri film amati". (2) Scrollando alla sezione piramide, il titolo "I tuoi pilastri" era tagliato dal notch iOS (mancava safe-area-inset-top).

**Soluzione applicata**:
1. **Footer integrato**: quando ci sono film extra (>6 amati), il footer è ora DENTRO la sezione `.ob-conf-section-last`. Quando non ci sono extra, il footer resta standalone.
2. **`.ob-conf-section-last`**: nuova classe CSS con `min-height: auto` (non forza 100dvh), `justify-content: flex-start`, e `padding-bottom: env(safe-area-inset-bottom)`.
3. **Padding top**: aggiunto `padding-top: calc(clamp(40px, 5vh, 60px) + env(safe-area-inset-top))` a `.ob-conf-section` per evitare taglio dal notch.
4. **Rimosso** `scroll-snap-align: start` dal footer (non serve più come snap point separato).

**Side effects**: Nessuno. Classi prefissate `ob-`.

---

## 10:30 [tipo: refactor]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Rimossa sezione "Altri film amati", semplificata fase confirm

**Problema di partenza**: La sezione "Altri film amati" era ridondante: il modale di sostituzione (click su card piramide) già permette di scambiare i film. L'utente doveva scrollare troppo (piramide → extra films → footer).

**Soluzione applicata**:
1. **Eliminata completamente** la sezione C "Altri film amati" (JSX + tutto il CSS `.ob-extra-*`).
2. **Aggiunto hint** sotto la piramide: "Tocca un film per sostituirlo con uno degli altri N amati" (classe `.ob-pyr-hint`, visibile solo se ci sono candidati).
3. **Footer semplificato**: unico `<div className="ob-conf-footer-section">` con snap, centrato verticalmente (60dvh), contiene contatore pilastri + bottone "Prosegui →".
4. **Rimosso** tutto il codice `swapSource`/`setSwapSource` (state, props, interface, overlay "↔ Scambia" sulla piramide, funzione `handleExtraClick`).
5. **Rimosso** hook `extraReveal` (non più necessario).
6. **`handlePillarClick`** ora apre direttamente il modale di sostituzione senza passare per swap.

**Side effects**: Nessuno. Classi prefissate `ob-`.

---

## 11:22 [tipo: refactor]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Riscritto: ora 626 righe (prima 1528)
- `src/components/onboarding/ConfirmPhase.tsx` — [NEW] Componente piramide + modale + footer (158 righe)
- `src/components/onboarding/onboarding.css.ts` — [NEW] Tutto il CSS (704 righe)
- `src/components/onboarding/types.ts` — [NEW] Tipi, costanti, interfacce (27 righe)
- `src/components/onboarding/useScrollReveal.ts` — [NEW] Hook IntersectionObserver (23 righe)

**Problema di partenza**: File monolitico di 1528 righe, difficile da navigare e mantenere.

**Soluzione applicata**:
Scomposto in 5 file coesivi. Build TypeScript pulita (0 errori). Nessuna modifica funzionale.

**Side effects**: Nessuno. L'import tree è corretto, il comportamento runtime è identico.
