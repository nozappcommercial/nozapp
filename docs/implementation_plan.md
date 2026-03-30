# Fix Onboarding: Font, Bottoni, Layout Piramide

## Panoramica

L'onboarding presenta 4 problematiche da risolvere su mobile:

1. Banda bianca in basso + font errato (deve essere **Cormorant Garamond**)
2. 4 bottoni di reazione → tornare ai **3 bottoni** del beta1.jsx (Amato / Non fa per me / Non l'ho visto)
3. Bottone "Prossimo Gruppo" troppo grande
4. Pagina di conferma (piramide) → redesign come **pagina scrollabile a step** senza pannelli laterali né bottom sheet

## User Review Required

> [!IMPORTANT]
> **Font Cormorant Garamond**: Attualmente il progetto è stato migrato su font locali Geist. Per tornare a Cormorant Garamond devo re-introdurre la dipendenza Google Fonts (come nel beta1.jsx) **oppure** scaricare il font in locale nella cartella `src/app/fonts/`. Quale preferisci?
> Suggerimento: download locale per coerenza GDPR e performance (come fatto con Geist).

> [!WARNING]
> **Impatto del font**: Il cambio riguarderà SOLO l'onboarding (variabili `--ob-serif` / `--ob-mono`) o vuoi rimappare anche le variabili globali `--font-serif` e `--font-mono` nel resto del sito?

## Modifiche Proposte

### Fix 1 — Banda bianca + Font Cormorant Garamond

**Banda bianca**: Causata da `height: 100dvh` su `.ob-root` con `overflow: hidden`. Quando la barra del browser mobile appare/scompare, il `100dvh` non copre il 100% reale dello schermo. Soluzione:

- Sostituire `height: 100dvh` con `min-height: 100dvh` e rimuovere `overflow: hidden` sulla fase welcome e step
- Per la fase step, mantenere la griglia `grid-template-rows` ma con `min-height: 100dvh`

**Font**: Aggiungere Cormorant Garamond (locale o Google Fonts) e rimappare `--ob-serif` su `'Cormorant Garamond', Georgia, serif` e `--ob-mono` su `'Courier Prime', monospace` (come nel beta1).

#### File toccati:

- `src/app/layout.tsx` — Aggiunta font Cormorant Garamond (+ Courier Prime opzionale)
- `src/components/onboarding/OnboardingFlow.tsx` — CSS variables update

---

### Fix 2 — Bottoni reazione: da 4 a 3 (come beta1)

Attualmente ci sono 4 elementi: ♥ Amato, ✕ Non fa per me, [Visto | Non visto] (split button).

Tornare al layout **beta1** con **3 bottoni uniformi**:

1. **♥ L'ho amato** → `reaction: "loved"`
2. **✕ Non fa per me** → `reaction: "disliked"`
3. **○ Non l'ho visto** → `reaction: "unseen"`

Si elimina la reaction `"seen"` come tipo separato (era ridondante: "visto" = "amato" o "non fa per me").

#### File toccati:

- `src/components/onboarding/OnboardingFlow.tsx` — JSX dei bottoni + rimozione CSS split-button

---

### Fix 3 — "Prossimo Gruppo" più piccolo

Ridurre il padding del bottone `.ob-btn-cont`:

```css
/* Prima */
padding: clamp(11px, 1.7vh, 15px) clamp(22px, 3vw, 36px);
/* Dopo */
padding: clamp(9px, 1.4vh, 12px) clamp(18px, 2.5vw, 28px);
font-size: clamp(8px, 1.1vw, 10px);
```

#### File toccati:

- `src/components/onboarding/OnboardingFlow.tsx` — CSS `.ob-btn-cont`

---

### Fix 4 — Pagina Conferma scrollabile (no pannelli, no sheets)

Redesign completo della fase `"confirm"` come **pagina unica scrollabile in altezza** con 3 sezioni:

#### Sezione A — "Il tuo profilo" (viewport iniziale)

- Titolo grande "Il tuo **profilo**" centrato
- Freccia animata (↓) che suggerisce di scrollare verso il basso
- `min-height: 100vh` per occupare tutto lo schermo iniziale

#### Sezione B — Piramide (compare con scroll)

- Animazione a comparsa (fade-in + translateY) usando `IntersectionObserver`
- Layout piramidale 1-2-3 centrato
- Ogni card draggable per riordinare
- Hover/click per sostituire (apre overlay modale, non bottom sheet)
- Pulsante "Prosegui →" alla fine

#### Sezione C — Film avanzati (compare con ulteriore scroll)

- Visibile solo se `lovedFilms.length > 6`
- Titolo "Altri film amati"
- Griglia di card dei film in surplus
- Click su una card per "scambiare" con un pilastro (logica click-click)

**Rimozione completa**: sidebar toggle, bottom sheet (`ob-rep-sheet`), backdrop blur, pannello laterale.

#### File toccati:

- `src/components/onboarding/OnboardingFlow.tsx` — JSX fase confirm + CSS

## Open Questions

1. **Font Cormorant**: locale o via Google Fonts? (vedi sopra) credo che usiamo google fonts, vedi pagine come /Volumes/Crucial/workspace/web/nozapp/src/app/redazione/page.tsx dove usiamo questo font
2. **Courier Prime** (il mono del beta1): stesso discorso, locale o Google Fonts?
3. **Reaction "seen"**: la elimino del tutto come tipo? Nel beta1 c'erano solo 3 scelte (loved/disliked/unseen). Confermami se è ok. unseen diventa seen or unseen un doppio tasto diviso in diagonale, tutti e.3 i tasti hanno le medesime dimensioni
