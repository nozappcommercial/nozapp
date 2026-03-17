# Nozapp — UI Redesign Prompt per Antigravity

Stai lavorando su **Nozapp**, una web app Next.js 14 con componenti Three.js. Hai pieno accesso al codebase. Il tuo compito è implementare le specifiche UI descritte di seguito nella loro interezza, apportando tutte le modifiche necessarie a qualsiasi file del progetto.

---

## Sistema di Design — Token globali

Unifica tutti i valori di colore, spaziatura, tipografia e motion in un unico file CSS (ad esempio `sphere.css` o un nuovo `tokens.css` importato globalmente). Propaga questi token ovunque siano presenti colori, border-radius o durate hardcoded.

```css
:root {
  --bg-base:    rgb(235, 231, 222);
  --bg-surface: rgba(242, 239, 232, 0.96);
  --bg-overlay: rgba(18, 8, 10, 0.50);

  --ember:     rgb(120, 39, 46);
  --ember-dim: rgba(120, 39, 46, 0.25);
  --gold:      rgb(181, 140, 42);
  --gold-dim:  rgba(181, 140, 42, 0.25);
  --cold:      rgb(59, 139, 158);
  --cold-dim:  rgba(59, 139, 158, 0.25);

  --text:  rgb(22, 10, 12);
  --dim:   rgba(22, 10, 12, 0.50);
  --muted: rgba(22, 10, 12, 0.30);

  --radius-sm:   8px;
  --radius-md:   16px;
  --radius-lg:   24px;
  --radius-xl:   32px;
  --radius-pill: 999px;

  --ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-snappy: cubic-bezier(0.4, 0.0, 0.2, 1);
  --duration-fast:   180ms;
  --duration-base:   300ms;
  --duration-slow:   480ms;
}
```

`background-color: var(--bg-base)` deve essere applicato globalmente al body. Elimina qualsiasi sfondo bianco puro residuo in tutta l'app.

---

## Navigazione Globale — Nav Header compatto

Rimuovi qualsiasi bottom tab bar esistente. La navigazione principale diventa un componente pill/capsula centrato, posizionato nella parte superiore della pagina, che non copre l'intera larghezza dello schermo.

**Posizione:**

```
position: fixed
top: env(safe-area-inset-top, 0px) + 8px
left: 50%
transform: translateX(-50%)
z-index: 200
```

**Struttura:** una pill scura (`background: var(--text)`, `border-radius: var(--radius-pill)`) con padding interno di 6px, che contiene i bottoni delle sezioni come ovali chiari quando attivi e trasparenti quando inattivi.

Sezioni: `SFERA` → `/home`, `CINEMA` → `/cinema`, `REDAZIONE` → `/editoriale`

- Item inattivo: `color: rgba(235,231,222,0.50)`, background trasparente
- Item attivo: `background: var(--bg-base)`, `color: var(--text)`, `border-radius: var(--radius-pill)`
- Transizione cambio: `background + color` crossfade 180ms `var(--ease-out)`
- Tap feedback: `scale(0.94)` su `:active`

La nav pill è nascosta durante onboarding e login/registrazione. In tutte le altre schermate aggiorna l'item attivo in base alla route corrente.

---

## Header Scroll-Aware

Crea un wrapper `<header>` fixed (top: 0, left: 0, right: 0, height: 56px, z-index: 150) con sfondo trasparente che contiene la nav pill. Questo wrapper implementa il comportamento scroll-aware:

- Scroll verso il basso → `translateY(-100%)`, 250ms ease-in
- Scroll verso l'alto (anche solo 8px) → `translateY(0)`, 300ms `var(--ease-out)`
- In cima alla pagina → sempre visibile

Assicurati che la logica di rilevamento scroll sia performante (usa `requestAnimationFrame` o `IntersectionObserver` se appropriato) e che funzioni correttamente in tutte le schermate dove l'header è presente.

---

## Sfera — Dimensioni e Layout

Il canvas Three.js deve occupare:

```
top: 56px
bottom: 0 + env(safe-area-inset-bottom)
left: 0; right: 0
```

Calcola la dimensione dinamicamente (`100dvh - 56px - safe-area`), non usare `100vh` fisso.

Il container della sezione sfera (`sphere-section`) deve avere `position: relative; height: 100dvh` in modo che i componenti figli posizionati in absolute siano ancorati a questa sezione e non al viewport globale.

Quando un nodo è selezionato e il film detail sheet si apre, la canvas rimane fullscreen (non si riduce). Lo sheet si sovrappone con uno scrim. Il nodo selezionato esegue un pulse (scale 1 → 1.3 → 1, 400ms).

Aggiungi `padding: 16px` al canvas per evitare troncamenti dei nodi ai bordi su mobile.

---

## Film Detail Card — Bottom Sheet Mobile

Implementa o aggiorna il film detail come bottom sheet che parte da `bottom: 0` (non sopra una bottom bar che non esiste più):

- `height: 50dvh`
- `border-radius: 24px 24px 0 0`
- Animazione entrata: `translateY(100%) → 0`, 480ms `var(--ease-out)`

**Struttura interna:**
1. Zona poster (180px): immagine locandina come background con `object-fit: cover; object-position: center 20%` e gradient overlay scuro dal basso. Titolo film (bianco, 22px) e attore/anno in basso a sinistra. Pulsante chiusura × (44×44px, top-right, sfondo semi-trasparente scuro, backdrop-filter blur).
2. Zona info (`var(--bg-surface)`): badge editoriale, tag temi, bottone ESPLORA.

Scrim sulla sfera durante apertura sheet: `position: fixed; inset: 0; background: var(--bg-overlay)`, opacity 0 → 1 sincronizzato con l'apertura dello sheet.

---

## ShellNavigator — Basso centrato, ancorato alla sezione sfera

Il componente ShellNavigator deve essere posizionato con `position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%)` all'interno del container `.sphere-section`. Non è fixed sul viewport — segue la sezione sfera quando si scorre verso il basso e scompare naturalmente quando la sfera esce dal viewport.

**Struttura:** pill orizzontale (`border-radius: var(--radius-pill)`) con freccia prev, label shell corrente con dot colorato, freccia next. Touch target minimo 44px per i controlli freccia.

Quando il film detail sheet è aperto: `opacity 0 + translateY(8px)`, 200ms. Quando il sheet si chiude: `opacity 1 + translateY(0)`, 300ms `var(--ease-out)`.

---

## Onboarding — Fullscreen, No Scroll

Il wrapper root dell'onboarding deve avere `height: 100dvh; overflow: hidden; overscroll-behavior: none`. Nessuna pagina dell'onboarding deve essere scrollabile.

**Layout fase `step`:**
- Header onboarding (52px): titolo app a sinistra, indicatore gruppo a destra
- Domanda (64px): Cormorant 28px
- Film card: `calc(100dvh - 52px - 64px - 96px)` — occupa tutto lo spazio rimanente
- Zona azione fissa (96px in basso): hint + dot indicator + pulsanti reazione

**Overlay completamento gruppo:** quando tutti i film del gruppo sono stati valutati, appare un overlay `position: absolute; inset: 0; background: rgba(235,231,222,0.96); z-index: 50` con checkmark animato, riepilogo film, e bottone "PROSSIMO GRUPPO →". Entra con `opacity 0→1 + scale(0.95→1)`, 350ms `var(--ease-spring)`.

---

## Swipe Card — Feedback fisico e blocco pull-to-refresh

Implementa il touch handling direttamente sulla card con `useRef` per le coordinate di partenza. Logica:

1. `onTouchStart`: salva `clientX` e `clientY` iniziali
2. `onTouchMove`: determina direzione al primo movimento > 8px. Se orizzontale, chiama `e.preventDefault()` (richiede listener `{ passive: false }` via `useEffect + addEventListener`), aggiorna `transform: translateX(dx) rotate(dx * 0.045deg)` in real-time, aggiorna opacità e scale dei badge AMATO/NON FA PER ME
3. `onTouchEnd`: se `|dx| >= threshold` (80px o 25% larghezza card, il maggiore) → esegui reazione; altrimenti → snap back con `transition: transform 320ms var(--ease-spring)`

Threshold: abbastanza alto da evitare trigger accidentali. Badge sovrapposti alla card con `position: absolute`, visibili in proporzione al progresso dello swipe.

Rimuovi le frecce ← → di navigazione tra film. Usa dot indicator cliccabili. Hint: `SWIPE PER VALUTARE · TAP DOT PER NAVIGARE`.

---

## Onboarding Confirm — Tap-to-Swap

Sostituisci qualsiasi drag & drop con il sistema tap-to-select + tap-to-place:

1. Tap su pillar → evidenzia con bordo `var(--ember)`, scale 1.04
2. Tap su un altro pillar → swap animato con Anime.js (`translateX` incrociato, 350ms `easeInOutQuart`)
3. Tap su film dal drawer → sostituisce il pillar selezionato
4. Tap fuori → deseleziona

Sotto il titolo "I TUOI PILASTRI": hint `TAP PER RIORDINARE · SWIPE DAL PANNELLO PER SOSTITUIRE`, Fragment Mono 9px muted.

---

## Drawer laterale onboarding — Solo in fase Confirm

Il drawer è presente **solo** quando `phase === "confirm"`.

**Trigger:** bottone pill `ALTRI PREFERITI →` posizionato `position: fixed; bottom: 24px; left: 16px`, 44px height, bordo `var(--ember)`, sfondo trasparente.

**Drawer:**
- `position: fixed; top: 0; bottom: 0; left: 0; width: min(280px, 80vw)`
- `transform: translateX(-100%)` → `translateX(0)`, 300ms `var(--ease-out)`, con scrim `rgba(18,8,10,0.40)` sincronizzato
- Chiusura: tap scrim oppure swipe-left sul drawer (threshold 40px), 250ms ease-in

**Locandine:**
- Quasi full-width del drawer: `width: calc(100% - 32px)`
- `aspect-ratio: 2/3; object-fit: cover; border-radius: var(--radius-md)`
- Titolo Cormorant 14px, attore/anno Fragment Mono 9px
- Tap su item senza pillar selezionato: flash rosso sulla griglia + testo `SELEZIONA UN PILASTRO DA SOSTITUIRE`

---

## Login Page

- `body` e container pagina login: `background-color: var(--bg-base)`
- Logo: rimuovi il box bianco, `background: transparent`, `mix-blend-mode: multiply` sull'immagine
- Wordmark "NoZapp": Cormorant Garamond italic 28px, centrato, `color: var(--text)`
- Layout: `display: flex; flex-direction: column; justify-content: center; min-height: 100dvh`
- Input: `background: var(--bg-surface)`, `border: 1px solid rgba(22,10,12,0.12)`, `border-radius: var(--radius-md)`
- Bottone primario: `background: var(--ember)`, `border-radius: var(--radius-md)`, `height: 52px`

---

## Sezioni Consigli della Redazione / Ora al Cinema

- Immagini articolo: `border-radius: var(--radius-md)`
- Avatar placeholder autore: initiali su `background: var(--ember-dim)`
- Container scroll orizzontale "Ora al Cinema": `padding-right: 16px`
- Tag film: singola riga, `text-overflow: ellipsis`, `max-width` definito
- Bottone "VEDI TUTTI": `border: 1.5px solid var(--text)`, `border-radius: var(--radius-pill)`, `padding: 8px 16px`
- Sezioni homepage impilate: `padding-bottom: 48px` per separazione visiva

---

## Sistema Animazioni — Matrice completa

Implementa o verifica che tutte queste transizioni siano presenti e corrette:

| Elemento | Trigger | Animazione | Durata | Easing |
|---|---|---|---|---|
| Film card swipe | touchmove | translateX + rotate | real-time | – |
| Film card exit | reazione | translateX(±150%) rotate(±20deg) | 280ms | ease-in |
| Film card enter | dopo exit | translateX(20px) scale(0.96) → idle | 320ms | ease-spring |
| Bottom sheet open | click nodo | translateY(100%) → 0 | 480ms | ease-out |
| Bottom sheet close | tap × | translateY(0) → 100% | 320ms | ease-in |
| Drawer open | tap trigger | translateX(-100%) → 0 | 300ms | ease-out |
| Nav pill item | cambio route | bg + color crossfade | 180ms | ease-out |
| Overlay completamento | tutti valutati | opacity+scale 0.95→1 | 350ms | ease-spring |
| Header hide | scroll down | translateY(-100%) | 250ms | ease-in |
| Header show | scroll up | translateY(0) | 300ms | ease-out |
| Shell navigator hide | sheet open | opacity 0 + translateY(8px) | 200ms | ease-in |
| Shell navigator show | sheet close | opacity 1 + translateY(0) | 300ms | ease-out |
| Pillar swap | tap-to-swap | cross-translateX | 350ms | easeInOutQuart |

---

## Feedback tattile

```typescript
if ('vibrate' in navigator) {
  if (reaction === 'loved')    navigator.vibrate(8);
  if (reaction === 'disliked') navigator.vibrate([6, 40, 6]);
  if (reaction === 'seen')     navigator.vibrate(4);
}
navigator.vibrate([10, 60, 10, 60, 10]); // errore
```

Aggiungi il feedback tattile in tutti i punti di reazione dell'onboarding e nelle azioni di errore.

---

## Note generali

- TypeScript: mantieni la type safety, non usare `any` salvo casi eccezionali documentati
- Nessun componente deve assumere l'esistenza di una bottom bar: aggiorna tutte le misure che usavano `bottom: 56px` per compensarla
- Testa tutte le modifiche su viewport mobile (375×812, 390×844, 430×932)
- Usa `100dvh` ovunque sia necessaria l'altezza viewport su mobile
- `overscroll-behavior: none` sull'onboarding root e sulle card swipe