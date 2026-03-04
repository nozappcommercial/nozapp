# Prompt — Schermata Login/Registrazione per "Sfera"

## Contesto

Stai lavorando su **NoZapp**, un'app Next.js 14 (App Router) con Supabase come backend/auth e Tailwind CSS + shadcn/ui per la UI. Devi implementare la schermata di autenticazione come componente React (`AuthPage.tsx`) da collocare in `src/app/(auth)/login/page.tsx`.

---

## Stack tecnico

- **Framework**: Next.js 14 App Router
- **Auth**: Supabase Auth (`@supabase/ssr`)
- **Styling**: CSS-in-JS con oggetto `styles` (stringa CSS) iniettato via `<style>` tag — **non usare Tailwind** per questo componente, tutto lo stile va scritto in CSS puro nello stesso file
- **Fonts**: Google Fonts — `Playfair Display` (serif, pesi 400/600/700/italic) + `DM Sans` (sans-serif, pesi 300/400/500), importati via `@import` dentro la stringa CSS
- **Lingua UI**: italiano

---

## Palette colori — RISPETTARE ESATTAMENTE

```
--bg:    rgb(248, 248, 238)   /* sfondo principale — carta calda */
--bg2:   rgb(240, 240, 228)   /* sfondo leggermente più scuro */
--paper: rgb(252, 252, 246)   /* sfondo card/input */
--ink:   rgb(22,  10,  12)    /* testo principale */
--ink2:  rgba(22, 10, 12, 0.5)
--ink3:  rgba(22, 10, 12, 0.28)
--ink4:  rgba(22, 10, 12, 0.1)
--r1:    rgb(73,  17, 24)     /* rosso scuro */
--r2:    rgb(88,  25, 27)
--r3:    rgb(120, 39, 46)     /* rosso principale */
--r4:    rgb(126, 41, 50)
```

Il tema è **chiaro** — sfondo carta, testo scuro, rosso come accento. Niente sfondi neri o scuri nel pannello form.

---

## Layout — Split a due colonne (responsive)

### Desktop (≥ 900px): layout affiancato
- **Pannello sinistro** (flex: 1): sfondo con gradiente rosso (`--r1` → `--r2` → `--r3`), contiene branding e tagline
- **Pannello destro** (480–520px fissi): sfondo `--paper`, contiene il form

### Mobile (< 900px): colonna singola
- Solo il pannello destro, a tutta larghezza
- In cima al form mostrare il branding (logo + nome app + sottotitolo) in versione compatta

---

## Pannello sinistro (solo desktop)

Contenuto:
- Logo dell'app (vedi sezione Logo sotto)
- Tagline in `Playfair Display` italic: *"Il cinema non si cerca, si scopre."*
- Separatore sottile (1px, `rgba(248,248,238,0.22)`, 32px di larghezza)
- Descrizione breve: *"Una sfera semantica che connette i film attraverso fili editoriali invisibili."*

Effetti decorativi:
- Texture noise leggera (SVG feTurbulence inline, opacità ~0.06)
- 3 anelli concentrici con `border: 1px solid rgba(248,248,238,0.1)` che ruotano lentamente in loop con animazione CSS (`rotate`), direzioni e velocità alternati (40s, 65s reverse, 90s)
- Film strip decorativa in fondo al pannello: fila di celle con due forellini ciascuna, opacità 0.14

---

## Logo component

Implementare un componente `Logo` che:
1. Se riceve la prop `src` (stringa), mostra `<img src={src} />` — **questo è il caso reale, quando il file logo sarà disponibile**
2. Se `src` è null/undefined, mostra un **SVG fallback** generativo: sfera con nodo centrale, 8 nodi satellite su orbite implicite collegati da linee sottili, e 2 cerchi concentrici leggeri
3. Supportare una prop `light` (boolean) per invertire i colori quando il logo è su sfondo scuro (pannello sinistro)

Colori SVG fallback su sfondo chiaro: `rgb(120,39,46)` per i nodi, `rgba(120,39,46,0.18)` per le linee, `rgb(126,41,50)` per il nodo centrale.
Colori SVG fallback su sfondo scuro (light=true): `rgba(248,248,238,0.9)` per i nodi, opacità ridotte per linee e cerchi.

---

## Funzionalità del form

### Selettore Login / Registrazione
- Tab switcher con **pillola animata** che scorre da una tab all'altra
- Animazione con `cubic-bezier(0.34, 1.56, 0.64, 1)` per effetto elastico
- Tab attiva: testo `--r3`, tab inattiva: testo `--ink3`

### Campi — Login
1. Email
2. Password (con toggle visibilità — icona occhio aperto/chiuso)
3. Link "Password dimenticata?" allineato a destra sotto il campo password

### Campi — Registrazione
1. Nome utente
2. Email
3. Password (con toggle + hint "Minimo 8 caratteri")
4. Conferma password (con toggle)

I campi di registrazione appaiono con una breve animazione di slide-in (`translateX(-5px)` → `0`) con `animation-delay` progressivo.

### Reset password
- Vista separata (non una modale), accessibile dal link "Password dimenticata?"
- Back button con freccia sinistra per tornare al login
- Solo campo email + bottone invio

---

## Validazione (lato client)

Validare prima di chiamare Supabase:
- Email: campo obbligatorio + regex formato valido
- Password: obbligatoria + lunghezza minima 8 caratteri
- Username (solo registrazione): obbligatorio + minimo 2 caratteri
- Conferma password (solo registrazione): deve coincidere con password

Messaggi di errore inline sotto ogni campo, con animazione di comparsa (`translateY(-3px)` → `0`). Stile: testo `rgb(175,50,50)`, font-size 0.69rem.

---

## Integrazione Supabase

Implementare i tre handler con le seguenti chiamate reali:

```ts
// Login
const { error } = await supabase.auth.signInWithPassword({
  email: form.email,
  password: form.password,
})

// Registrazione
const { error } = await supabase.auth.signUp({
  email: form.email,
  password: form.password,
  options: {
    data: { display_name: form.username }
  }
})
// Nota: Supabase invia automaticamente l'email di conferma se configurato nel dashboard

// Reset password
const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
  redirectTo: `${window.location.origin}/auth/callback?next=/profile`
})
```

Usare `createBrowserClient` da `@/lib/supabase/client` — mai importare da `@supabase/supabase-js` direttamente.

Dopo login riuscito: redirect a `/sphere` (o `/onboarding` se `onboarding_complete = false`).
Dopo registrazione riuscita: mostrare alert di successo che invita a controllare l'email di conferma.

---

## Alert feedback

Componente alert inline (non toast) con due varianti:
- **Success**: sfondo `rgba(40,100,60,0.07)`, bordo `rgba(60,150,90,0.25)`, testo `rgb(30,95,52)`
- **Error**: sfondo `rgba(120,39,46,0.07)`, bordo `rgba(120,39,46,0.25)`, testo `--r2`

Comparsa con animazione `translateY(-5px)` → `0`.

---

## Bottone submit

- Gradiente: `--r3` → `--r1` (135deg)
- Testo: `rgb(248,248,238)`, uppercase, letter-spacing 0.14em, font DM Sans 500
- Hover: `translateY(-1px)` + ombra più intensa
- Disabled: opacità 0.45, cursor not-allowed
- Loading state: spinner CSS (border + border-top-color animato in rotation)
- Label: "Entra nella Sfera" (login) / "Crea Account" (register) / "Invia link di reset" (reset)

---

## Animazioni generali

- Card/form: `cardIn` — `opacity: 0; translateY(14px)` → `opacity: 1; translateY(0)`, durata 0.5s, `cubic-bezier(0.16, 1, 0.3, 1)`
- Switch vista (login ↔ reset): `viewIn` — `opacity: 0; translateY(7px)` → stato finale, 0.3s
- Texture carta di sfondo: `repeating-linear-gradient` orizzontale con righe sottilissime ogni 28px

---

## Responsive breakpoints

| Breakpoint | Comportamento |
|---|---|
| < 480px | Padding ridotto (20px laterali) |
| 480–899px | Colonna singola, branding mobile visibile |
| ≥ 900px | Layout split, branding mobile nascosto (`display: none`) |
| ≥ 1200px | Pannello destro allargato a 520px |

---

## Struttura file

```
src/
└── app/
    └── (auth)/
        └── login/
            └── page.tsx     ← componente AuthPage (Client Component: 'use client')
```

Il componente è un **Client Component** (`'use client'`) perché gestisce stato locale, interazioni e chiamate browser-side a Supabase.

---

## Note finali

- Nessun import di librerie di terze parti oltre a React e Supabase — tutto lo stile è CSS puro nella stringa `styles`
- Le icone (occhio, freccia) sono SVG inline come componenti React minimali
- Il componente accetta una prop opzionale `logoSrc?: string` per passare il path del logo reale quando disponibile
- TypeScript strict: nessun `any`, tipi espliciti per tutti i valori di stato
