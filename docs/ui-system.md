---
tags: [#macroarea/ui-system, #status/complete]
created: 2026-03-26
agent: scrittore
source-files: [src/app/layout.tsx, src/components/layout/Header.tsx, src/components/ui/SplashScreen.tsx, src/app/globals.css]
---

# UI System

[← Torna all'indice](./progetto.md)

## Scopo
La macroarea **UI System** definisce l'identità visiva e l'esperienza di navigazione di NoZapp. Gestisce il design system basato su Tailwind CSS, i componenti atomici, il layout globale responsivo e le micro-interazioni (come lo scroll spy e le animazioni di caricamento) che conferiscono all'app un aspetto premium e fluido.

## File coinvolti
| File | Ruolo |
|------|-------|
| `src/app/layout.tsx` | Struttura root, configurazione font e inizializzazione servizi. |
| `src/components/layout/Header.tsx` | Navigazione ibrida (verticale/orizzontale) con Scroll Spy. |
| `src/components/ui/SplashScreen.tsx` | Animazione di ingresso all'avvio dell'applicazione. |
| `src/app/globals.css` | Token di design, variabili Shadcn e stili base. |

## Struttura e funzionamento

### Design System & Tipografia
NoZapp utilizza un'estetica raffinata basata su due font principali caricati via Google Fonts:
- **Cormorant Garamond**: Per i titoli e l'atmosfera "editoriale".
- **Fragment Mono**: Per i dati tecnici, i tag e gli elementi di navigazione.
I colori seguono una palette naturale (Cream, Ink, Gold, Ember).

### Navigazione Dinamica (Header)
Il componente `Header.tsx` implementa un sistema complesso che si adatta al contesto:
- **Desktop**: Una sidebar verticale sottile posizionata a sinistra.
- **Mobile**: Una barra orizzontale superiore.
- **Scroll Spy**: Utilizza `IntersectionObserver` per evidenziare automaticamente la sezione corrente (`#sfera`, `#redazione`, `#cinema`).
- **Bubble Indicator**: Un indicatore visivo (bolla/pillola) che insegue la voce di menu attiva con animazioni fluide gestite via CSS e `ResizeObserver`.

### `updateBubble` — `src/components/layout/Header.tsx`
**Scopo**: Posizionamento pixel-perfect dell'indicatore di navigazione.
**Esempio dal codice**:
```tsx
// path: src/components/layout/Header.tsx
const updateBubble = useCallback(() => {
    const activeItem = navItemsRef.current[itemToShow];
    if (activeItem && container) {
        const itemRect = activeItem.getBoundingClientRect();
        // Calcola posizione relativa per layout verticale o orizzontale
        setBubbleStyle({
            top: itemRect.top - containerRect.top + (itemRect.height - 28) / 2,
            left: itemRect.left - containerRect.left + (itemRect.width - 28) / 2,
            opacity: 1
        });
    }
}, [activeSection, hoveredSection]);
```

### Esperienza "App-like"
- **SplashScreen**: Un overlay a tutto schermo che nasconde il caricamento della [[sphere-engine]] e fornisce un feedback visivo immediato (pulse logo).
- **PWA Ready**: Configurazione specifica per iOS (`black-translucent`, `viewport-fit=cover`) per un'esperienza "edge-to-edge".
- **Glassmorphism**: Utilizzo intensivo di `backdrop-filter` e variabili CSS dinamiche per effetti di sfocatura che reagiscono allo scroll.

## Relazioni con altre macroaree
- [[auth]]: L'Header include le azioni di Logout e Profilo.
- [[sphere-engine]]: L'Header coordina la propria visibilità con l'apertura del pannello dettagli della sfera.
- [[onboarding]]: Il layout maschera la navigazione globale durante il flusso di onboarding.

## Problemi noti
- `Header.tsx`: Gestione complessa degli stati mobile/desktop in un unico file.
- `SplashScreen.tsx`: Utilizzo di stili inline e `styled-jsx` che differiscono dal resto del progetto.
- **Logout**: Utilizzo di `window.location.href` forzato anziché del router Next.js.

---
> ⚠️ Da verificare: Il sistema di scroll basato su `animejs` nell'Header potrebbe andare in conflitto con lo scroll nativo su alcuni browser mobile.
