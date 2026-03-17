> Documento di lavoro · Versione 3.0 · Marzo 2026  
> Aggiornato con le revisioni di Marco (review del 16/03/2026)

---

## 1. Sistema di Design — Token globali

Tutti i componenti dell'app devono usare esclusivamente questi token. Da aggiornare in `sphere.css` e propagare ovunque si usino colori hardcoded.

```css
:root {
  /* ── Backgrounds ─────────────────────────────── */
  --bg-base:    rgb(235, 231, 222);          /* sfondo unico di tutta l'app */
  --bg-surface: rgba(242, 239, 232, 0.96);  /* card, sheet, header, drawer */
  --bg-overlay: rgba(18, 8, 10, 0.50);       /* scrim sopra la sfera/contenuto */

  /* ── Brand accents ───────────────────────────── */
  --ember:     rgb(120, 39, 46);
  --ember-dim: rgba(120, 39, 46, 0.25);
  --gold:      rgb(181, 140, 42);
  --gold-dim:  rgba(181, 140, 42, 0.25);
  --cold:      rgb(59, 139, 158);
  --cold-dim:  rgba(59, 139, 158, 0.25);

  /* ── Typography ──────────────────────────────── */
  --text:      rgb(22, 10, 12);
  --dim:       rgba(22, 10, 12, 0.50);
  --muted:     rgba(22, 10, 12, 0.30);

  /* ── UI Chrome ───────────────────────────────── */
  --radius-sm:  8px;
  --radius-md:  16px;
  --radius-lg:  24px;
  --radius-xl:  32px;
  --radius-pill: 999px;

  /* ── Motion ──────────────────────────────────── */
  --ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-snappy: cubic-bezier(0.4, 0.0, 0.2, 1);
  --duration-fast:   180ms;
  --duration-base:   300ms;
  --duration-slow:   480ms;
}
```

**Sfondo body**: `background-color: var(--bg-base)` — da applicare globalmente. Elimina qualsiasi sfondo bianco puro residuo (login inclusa).

---

## 2. Navigazione Globale — Nav Header compatto

### Concept

La navigazione principale **non è una bottom bar** a tutta larghezza, ma un componente compatto a forma di pill/capsula posizionato nell'header, che non occupa l'intera larghezza della pagina. Il modello visivo è una barra scura arrotondata che contiene le sezioni come bottoni ovali separati — visivamente analogo a un segmented control floating.

### Layout e posizione

```
Position: fixed
Top: env(safe-area-inset-top, 0px) + 8px
Left: 50%
Transform: translateX(-50%)
Z-index: 200

Larghezza: auto (contenuto), max: calc(100vw - 32px)
Altezza: 48px
```

**Struttura HTML:**

```html
<nav class="nav-pill">
  <button class="nav-item" data-route="/home">SFERA</button>
  <button class="nav-item" data-route="/cinema">CINEMA</button>
  <button class="nav-item" data-route="/editoriale">REDAZIONE</button>
</nav>
```

**CSS:**

```css
.nav-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  background: var(--text);                    /* pill scura */
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 24px rgba(18, 8, 10, 0.20);
}

.nav-item {
  height: 36px;
  padding: 0 18px;
  border-radius: var(--radius-pill);
  border: none;
  background: transparent;
  color: rgba(235, 231, 222, 0.50);           /* inattivo: muted chiaro */
  font-family: 'Fragment Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-spring);
}

.nav-item.active {
  background: var(--bg-base);                 /* highlight: ovale chiaro */
  color: var(--text);
}

.nav-item:active {
  transform: scale(0.94);
}
```

**Animazione cambio sezione:**

- Item attivo: `background` + `color` crossfade in `var(--duration-fast)` (180ms)
- Contenuto pagina: fade-in `opacity 0 → 1` + `translateY(6px) → translateY(0)`, 300ms, `var(--ease-out)`

**Visibilità:**

- La nav pill **non è presente** durante l'onboarding (fase `step` e `confirm`)
- La nav pill **non è presente** nelle schermate di login/registrazione
- In tutte le altre schermate è sempre visibile e aggiorna l'item attivo al cambio di route

---

## 3. Header Scroll-Aware

### Comportamento

- **Scroll verso il basso** → header (e nav pill) si nascondono con `translateY(-100%)`, transizione 250ms `ease-in`
- **Scroll verso l'alto (anche solo 8px)** → header riappare con `translateY(0)`, transizione 300ms `var(--ease-out)`
- **Top della pagina** → header sempre visibile

### Specifiche

```
Position: fixed
Top: 0
Left: 0, Right: 0
Height: 56px (comprende nav pill + padding verticale)
Z-index: 150

Background: transparent (la nav pill ha il proprio sfondo)
Transition: transform 250ms/300ms ease
```

La nav pill è contenuta dentro questo wrapper `header` e ne segue il comportamento scroll. Il wrapper header ha sfondo trasparente — non crea una band colorata ma permette alla pill di sembrare flottante sulla pagina.

**Nella schermata Sfera**: l'item SFERA rimane attivo. Quando il film detail sheet è aperto, l'header con la nav pill rimane visibile.

**Non presente in**: login, registrazione, onboarding.

---

## 4. Sfera — Dimensioni e Layout

### Area di rendering

```
Canvas Three.js:
  Top: 56px (sotto header)
  Bottom: 0 + env(safe-area-inset-bottom)
  Left: 0, Right: 0

Viewport utile canvas = 100dvh - 56px - safe-area (~12px) ≈ 660px su iPhone 16
```

Il canvas deve essere dimensionato dinamicamente su questo valore, non su `100vh` fisso.

### Ridimensionamento con film selezionato

Quando l'utente clicca un nodo, il film detail sale come sheet dal basso. La canvas **NON si riduce** — rimane fullscreen. Lo sheet si sovrappone con uno scrim.

- **Sheet altezza**: `50dvh` (da bordo inferiore dello schermo)
- **Canvas**: rimane invariata, la sfera è parzialmente oscurata dallo sheet ma continua a ruotare lentamente in idle
- **Nodo selezionato**: si anima verso il centro-alto della canvas con un brief pulse (scale 1 → 1.3 → 1, 400ms)

### Margini

Aggiungere `padding: 16px` alla canvas per garantire che i nodi ai bordi non vengano troncati su mobile.

---

## 5. Film Detail Card — Mobile (poster come sfondo)

### Mobile — Adattamento

La card si comporta come un **bottom sheet** con due zone distinte:

```
┌─────────────────────────────────┐  ← border-radius 24px
│  [drag handle 32×4px centrato]  │
│                                 │  ← zona poster
│   LOCANDINA come background     │  altezza: 180px
│   gradient overlay scuro        │  object-fit: cover
│   [Titolo film — bianco 22px]   │
│   [Attore · Anno — muted 11px]  │
│                                 │
├─────────────────────────────────┤  ← bg-surface
│   [Badge PILASTRO DEL GUSTO]    │  altezza: variabile
│   TEMI EDITORIALI               │  scroll interno se
│   [tag] [tag] [tag]             │  necessario
│   [tag] [tag]                   │
│                                 │
│   [Bottone ESPLORA →]           │
└─────────────────────────────────┘
  ← pulsante × in posizione absolute, top-right, 44×44px touch target
```

**Specifiche sheet:**

```css
.film-detail-sheet {
  position: fixed;
  bottom: 0;
  left: 0; right: 0;
  height: 50dvh;
  border-radius: 24px 24px 0 0;
  background: var(--bg-surface);
  box-shadow: 0 -8px 40px rgba(18, 8, 10, 0.18);
  overflow: hidden;

  transform: translateY(100%);
  transition: transform var(--duration-slow) var(--ease-out);
}
.film-detail-sheet.open {
  transform: translateY(0);
}
```

**Zona poster:**

```css
.sheet-poster {
  width: 100%;
  height: 180px;
  position: relative;
  overflow: hidden;
}
.sheet-poster img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center 20%;
}
.sheet-poster::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(18, 8, 10, 0.05) 0%,
    rgba(18, 8, 10, 0.65) 100%
  );
}
.sheet-poster-text {
  position: absolute; bottom: 12px; left: 16px; right: 44px;
  z-index: 2;
  color: white;
}
```

**Pulsante chiusura:**

```css
.sheet-close {
  position: absolute; top: 12px; right: 12px;
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(18, 8, 10, 0.35);
  border-radius: var(--radius-pill);
  backdrop-filter: blur(4px);
  color: white;
  z-index: 10;
  border: none; cursor: pointer;
}
```

**Scrim sulla sfera durante apertura sheet:**

```css
.sphere-scrim {
  position: fixed; inset: 0;
  background: var(--bg-overlay);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-base) var(--ease-out);
  z-index: 90;
}
.sphere-scrim.active {
  opacity: 1;
  pointer-events: auto;
}
```

---

## 6. ShellNavigator — Posizionamento

### Concept

Lo ShellNavigator si posiziona **in basso al centro della sezione sfera**, non fixed rispetto al viewport. Quando l'utente scorre verso il basso (nelle sezioni successive alla sfera), il navigator rimane ancorato al fondo della sezione sfera e scorre fuori viewport insieme ad essa — non segue l'utente oltre la propria sezione.

### Implementazione

Il container della sezione sfera ha `position: relative`. Lo ShellNavigator è posizionato in absolute nella parte inferiore di quel container:

```css
/* Il container della sezione sfera */
.sphere-section {
  position: relative;
  height: 100dvh;           /* occupa l'intera viewport */
  overflow: visible;
}

/* ShellNavigator — ancorato al fondo della sezione */
.shell-navigator {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 120;

  background: var(--bg-surface);
  border: 1px solid rgba(22, 10, 12, 0.10);
  border-radius: var(--radius-pill);
  padding: 6px 16px;
  box-shadow: 0 4px 20px rgba(18, 8, 10, 0.12);
  backdrop-filter: blur(12px);

  display: flex;
  align-items: center;
  gap: 12px;
}
```

**Struttura:**

```
[← freccia prev]  [● NOME SHELL]  [→ freccia next]
```

Ogni freccia: `width: 32px; height: 32px`, touch target minimo `44px` tramite padding negativo o pseudo-elemento. Label shell: Fragment Mono 10px uppercase, dot colorato con il colore della shell attiva.

**Comportamento:**

- Quando il film detail sheet è aperto, il navigator esce con `opacity 0 + translateY(8px)`, 200ms — non slide laterale
- Torna visibile quando il sheet si chiude: `opacity 1 + translateY(0)`, 300ms, `var(--ease-out)`
- Durante lo scroll verso le sezioni inferiori: scorre via naturalmente con la sezione sfera (no comportamento sticky)

---

## 7. Onboarding — Fullscreen, No Scroll

### Soluzione: pannelli fullscreen bloccati

```css
.onboarding-root {
  height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
  position: relative;
  background: var(--bg-base);
}
```

**Layout fisso per la fase `step`:**

```
[0px   ]  Header onboarding (52px)
           ← "La Sfera Semantica"    "● ○ ○  GRUPPO 1/3" →

[52px  ]  Domanda (64px)
           "Questo film ti appartiene?"  — Cormorant 28px

[116px ]  Film card — occupa: calc(100dvh - 52 - 64 - 96) ≈ 428px
           (scrollabile internamente solo se necessario)

[auto  ]  Zona azione fissa in basso (96px)
           hint testo  |  dot indicator  |  pulsanti reazione

[bottom]  (nessun header nav durante onboarding)
```

**Pulsante "PROSSIMO GRUPPO"**: appare come **overlay fullscreen di completamento** animato, sopra il contenuto:

```
overlay: position absolute, inset 0, background rgba(235,231,222,0.96), z-index 50
contenuto centrale:
  ✓ animato (Anime.js draw/scale)
  "GRUPPO 1 COMPLETATO"
  Lista pill dei film valutati
  [PROSSIMO GRUPPO →]  ← bottone black pill
```

L'overlay entra con `opacity 0 → 1` + `scale(0.95) → scale(1)`, 350ms `var(--ease-spring)`.

---

## 8. Swipe Card — Feedback fisico e blocco pull-to-refresh

**Stato touch nel componente:**

```typescript
const touchStartX = useRef<number | null>(null);
const touchStartY = useRef<number | null>(null);
const isDraggingCard = useRef(false);
const THRESHOLD = 80; // px, o 25% della larghezza card (il maggiore)
```

**onTouchStart:**

```typescript
function onTouchStart(e: React.TouchEvent) {
  touchStartX.current = e.touches[0].clientX;
  touchStartY.current = e.touches[0].clientY;
  isDraggingCard.current = false;
}
```

**onTouchMove — segui il dito + blocca verticale:**

```typescript
function onTouchMove(e: React.TouchEvent) {
  if (touchStartX.current === null || touchStartY.current === null) return;
  const dx = e.touches[0].clientX - touchStartX.current;
  const dy = e.touches[0].clientY - touchStartY.current;

  if (!isDraggingCard.current) {
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      isDraggingCard.current = Math.abs(dx) > Math.abs(dy);
    }
    return;
  }

  if (isDraggingCard.current) {
    e.preventDefault(); // blocca pull-to-refresh e scroll
    const rotation = dx * 0.045;
    const threshold = Math.max(THRESHOLD, cardRef.current?.offsetWidth * 0.25 ?? THRESHOLD);
    const progress = Math.min(1, Math.abs(dx) / (threshold * 1.5));

    cardRef.current!.style.transform = `translateX(${dx}px) rotate(${rotation}deg)`;
    cardRef.current!.style.transition = 'none';

    setBadgeLeft(dx > 0 ? Math.min(1, progress) : 0);
    setBadgeRight(dx < 0 ? Math.min(1, progress) : 0);
  }
}
```

> `e.preventDefault()` su `touchmove` richiede listener registrato con `{ passive: false }` tramite `useEffect` + `addEventListener` sul ref della card.

**onTouchEnd:**

```typescript
function onTouchEnd(e: React.TouchEvent) {
  if (!isDraggingCard.current || touchStartX.current === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX.current;
  const threshold = Math.max(THRESHOLD, cardRef.current?.offsetWidth * 0.25 ?? THRESHOLD);

  if (Math.abs(dx) >= threshold) {
    handleReaction(dx > 0 ? "loved" : "disliked");
  } else {
    cardRef.current!.style.transition = 'transform 320ms var(--ease-spring)';
    cardRef.current!.style.transform = 'translateX(0) rotate(0deg)';
    setBadgeLeft(0);
    setBadgeRight(0);
  }
  touchStartX.current = null;
  touchStartY.current = null;
  isDraggingCard.current = false;
}
```

**Badge sovrapposto alla card:**

```tsx
<div
  className="swipe-badge swipe-badge-love"
  style={{ opacity: badgeLeft, transform: `scale(${0.8 + badgeLeft * 0.2})` }}
>
  ♥ AMATO
</div>
<div
  className="swipe-badge swipe-badge-nope"
  style={{ opacity: badgeRight, transform: `scale(${0.8 + badgeRight * 0.2})` }}
>
  ✕ NON FA PER ME
</div>
```

```css
.swipe-badge {
  position: absolute; top: 20px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-family: 'Fragment Mono', monospace;
  font-size: 12px; letter-spacing: 0.1em; font-weight: 700;
  pointer-events: none;
  border: 2px solid currentColor;
}
.swipe-badge-love  { left: 16px;  color: rgb(60,140,60);  background: rgba(60,140,60,0.12); transform-origin: top left; }
.swipe-badge-nope  { right: 16px; color: var(--ember);    background: var(--ember-dim);     transform-origin: top right; }
```

**Navigazione tra film del gruppo:**

- **Dot indicator**: tap su un dot → naviga al film corrispondente
- Nessuna freccia ← → separata
- Hint: `SWIPE PER VALUTARE · TAP DOT PER NAVIGARE`

---

## 9. Onboarding Confirm — Tap-to-Swap

Il drag & drop mobile è sostituito con **tap-to-select + tap-to-place**:

```typescript
const [selectedPillarIdx, setSelectedPillarIdx] = useState<number | null>(null);
```

**Interazione:**

1. Tap su un pillar → bordo `--ember`, scale 1.04, stato `selected`
2. Tap su un altro pillar → i due si scambiano posizione con Anime.js
3. Tap su un film dal drawer → sostituisce il pillar selezionato
4. Tap fuori → deseleziona

**Animazione swap:**

```javascript
anime({
  targets: [pillarA_el, pillarB_el],
  translateX: [posA_x - posB_x, 0],
  duration: 350,
  easing: 'easeInOutQuart',
});
```

**Hint sotto il titolo "I TUOI PILASTRI":** `TAP PER RIORDINARE · SWIPE DAL PANNELLO PER SOSTITUIRE` — Fragment Mono 9px muted.

---

## 10. Drawer laterale onboarding — Solo in fase Confirm

Il drawer è visibile **esclusivamente** quando `phase === "confirm"`.

### Trigger di apertura

Bottone pill posizionato **in basso a sinistra** della fase confirm:

```css
.sideboard-trigger {
  position: fixed;
  bottom: 24px;
  left: 16px;
  height: 44px;
  padding: 0 20px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--ember);
  background: transparent;
  color: var(--ember);
  font-family: 'Fragment Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  /* Icona freccia → inclusa nel testo o come SVG 16px */
}
```

Label: `ALTRI PREFERITI →`

### Posizione e dimensioni drawer

```css
.onboarding-sideboard {
  position: fixed;
  top: 0; bottom: 0; left: 0;
  width: min(280px, 80vw);
  background: var(--bg-surface);
  border-right: 1px solid rgba(22, 10, 12, 0.10);
  box-shadow: 4px 0 32px rgba(18, 8, 10, 0.15);
  z-index: 300;
  overflow-y: auto;
  overscroll-behavior: contain;

  transform: translateX(-100%);
  transition: transform var(--duration-base) var(--ease-out);
}
.onboarding-sideboard.open {
  transform: translateX(0);
}
```

### Scrim

```css
.sideboard-scrim {
  position: fixed; inset: 0;
  background: rgba(18, 8, 10, 0.40);
  opacity: 0; pointer-events: none;
  transition: opacity var(--duration-base);
  z-index: 299;
}
.sideboard-scrim.active {
  opacity: 1; pointer-events: auto;
}
```

### Locandine nel drawer

- Ogni item: `width: 100%`, locandina `aspect-ratio: 2/3`, `border-radius: var(--radius-md)`, `object-fit: cover`
- Larghezza locandina: `calc(100% - 32px)` — quasi full-width del drawer, non miniatura
- Titolo sotto: Cormorant 14px; attore/anno: Fragment Mono 9px
- Tap sull'item → sostituisce il pillar selezionato. Se nessun pillar selezionato: flash rosso sulla griglia con label `SELEZIONA UN PILASTRO DA SOSTITUIRE`

### Animazione apertura/chiusura

- **Apertura**: drawer `translateX(-100%) → 0` + scrim `opacity 0 → 1`, entrambi 300ms `var(--ease-out)` — sincroni
- **Chiusura**: drawer `translateX(0) → -100%)` + scrim `opacity 1 → 0`, 250ms `ease-in` — sincroni
- **Chiusura via**: tap sullo scrim **oppure** swipe-left sul drawer (threshold 40px)

---

## 11. Login Page — Fix centramento e sfondo

**Sfondo:** `background-color: var(--bg-base)` su `body` e sul container della pagina login.

**Logo:**

```css
.login-logo-container {
  background: transparent;
  border: none; box-shadow: none; padding: 0;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  margin: 0 auto 32px;
}
.login-logo-container img {
  width: 80px; height: 80px;
  border-radius: var(--radius-lg);
  mix-blend-mode: multiply;
}
.login-wordmark {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 28px; font-weight: 400;
  color: var(--text); text-align: center; letter-spacing: 0.02em;
}
```

**Posizionamento:** `display: flex; flex-direction: column; justify-content: center; min-height: 100dvh`

**Input fields:** `background: var(--bg-surface)`, `border: 1px solid rgba(22,10,12,0.12)`, `border-radius: var(--radius-md)` — eliminare bordi bianchi/grigi difformi.

**Bottone primario** ("ENTRA NELLA SFERA", "CREA ACCOUNT"):

- Background: `var(--ember)`
- Border-radius: `var(--radius-md)` (16px)
- Height: 52px

---

## 12. Sezioni Aggiuntive — Consigli della Redazione / Ora al Cinema

**"Consigli della Redazione":**

- Immagine articolo: aggiungere `border-radius: var(--radius-md)`
- Avatar placeholder "SCRITTO DA": initiali su `--ember-dim` invece di macchia grigia
- Header di pagina: gestito dall'header globale scroll-aware (sezione 3)

**"Ora al Cinema":**

- Container orizzontale scroll: aggiungere `padding-right: 16px`
- Tag editoriali: singola riga con `text-overflow: ellipsis` e `max-width`
- Bottone "VEDI TUTTI": `border: 1.5px solid var(--text)`, `border-radius: var(--radius-pill)`, `padding: 8px 16px`
- Sezioni impilate in homepage: `padding-bottom: 48px` per separazione visiva

### Card film (componente condiviso):

```css
.film-card { border-radius: var(--radius-md); overflow: hidden; background: var(--bg-surface); }
.film-card-poster { width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block; }
.film-card-body { padding: 10px 12px; }
.film-card-tag {
  display: inline-block;
  border: 1px solid var(--cold); color: var(--cold);
  border-radius: var(--radius-sm);
  font-family: 'Fragment Mono', monospace; font-size: 8px;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px 6px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;
}
```

---

## 13. Sistema Animazioni

Livello scelto: **Espressivo e caratterizzante** — il movimento è parte dell'identità del prodotto.

### Principi

1. Ogni azione ha una risposta fisica — nessun cambio di stato è istantaneo
2. Gli elementi entrano da una direzione logica — sheet dal basso, drawer da sinistra
3. Spring easing per elementi "tattili" — card swipe, bottoni tap, badge reazione
4. Ease-out per overlay/scrim — entrano veloci, percepiti come "materici"

### Matrice animazioni chiave

| Elemento | Trigger | Animazione | Durata | Easing |
|---|---|---|---|---|
| Film card swipe | `touchmove` | `translateX + rotate` | real-time | – |
| Film card exit | reazione | `translateX(±150%) rotate(±20deg)` | 280ms | ease-in |
| Film card enter | dopo exit | `translateX(20px) scale(0.96)` → idle | 320ms | ease-spring |
| Badge swipe | `touchmove` | `opacity + scale` | real-time | – |
| Bottom sheet open | click nodo | `translateY(100%) → 0` | 480ms | ease-out |
| Bottom sheet close | tap × / scrim | `translateY(0) → 100%` | 320ms | ease-in |
| Drawer open | tap trigger | `translateX(-100%) → 0` | 300ms | ease-out |
| Nav pill item | cambio route | bg + color crossfade | 180ms | ease-out |
| Overlay completamento | tutti valutati | `opacity+scale 0.95→1` | 350ms | ease-spring |
| Header hide | scroll down | `translateY(-100%)` | 250ms | ease-in |
| Header show | scroll up | `translateY(0)` | 300ms | ease-out |
| Shell navigator hide | sheet open | `opacity 0 + translateY(8px)` | 200ms | ease-in |
| Shell navigator show | sheet close | `opacity 1 + translateY(0)` | 300ms | ease-out |
| Pillar swap | tap-to-swap | cross-translateX | 350ms | easeInOutQuart (Anime.js) |

---

## 14. Feedback tattile (API Vibration)

```typescript
if ('vibrate' in navigator) {
  if (reaction === 'loved')    navigator.vibrate(8);
  if (reaction === 'disliked') navigator.vibrate([6, 40, 6]);
  if (reaction === 'seen')     navigator.vibrate(4);
}
// Errore (es. troppo pochi pilastri)
navigator.vibrate([10, 60, 10, 60, 10]);
```

---

## Priorità di implementazione

| Priorità | Item | Impatto | Complessità |
|---|---|---|---|
| 🔴 P0 | Blocco pull-to-refresh (CSS + JS) | Critico | Bassa |
| 🔴 P0 | Token colori unificati in `sphere.css` | Alto | Bassa |
| 🔴 P0 | Login: rimozione box bianco + centramento | Alto | Bassa |
| 🟠 P1 | Nav header compatto (pill, al posto della bottom bar) | Alto | Media |
| 🟠 P1 | Onboarding fullscreen locked (no scroll) | Alto | Media |
| 🟠 P1 | Swipe card con feedback fisico | Alto | Media |
| 🟠 P1 | Film detail sheet con poster (bottom: 0, no bottom bar) | Alto | Media |
| 🟡 P2 | Header scroll-aware (wrapper nav pill) | Medio | Bassa |
| 🟡 P2 | ShellNavigator riposizionamento (basso centrato, sticky to section) | Medio | Bassa |
| 🟢 P3 | Overlay completamento gruppo onboarding | Medio | Media |
| 🟢 P3 | Tap-to-swap nella fase confirm | Medio | Media |
| 🟢 P3 | Drawer onboarding (scrim, locandine grandi, animazioni) | Basso | Media |
| 🟢 P3 | Feedback tattile (vibration API) | Basso | Bassa |

---

_Fine documento — v3.0_