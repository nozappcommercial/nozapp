---
titolo: "Standard Animazioni"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: interfaccia-utente
---

# Standard Animazioni

## Panoramica
Le animazioni in nozapp non sono solo ornamentali, ma servono a guidare l'attenzione dell'utente e a fornire feedback immediato. Il progetto utilizza principalmente `Framer Motion` per la logica dichiarativa e `Animejs` per animazioni più specifiche o imperative.

## Analisi tecnica

### Effetti di Reveal
**Percorso:** `src/components/animations/ScrollReveal.tsx`
**Ruolo:** Gestione dell'ingresso dei contenuti allo scroll.

**Descrizione:**
Componente wrapper che utilizza `whileInView` di Framer Motion. 
- **Ease standard**: Utilizza una curva di bezier personalizzata `[0.21, 0.47, 0.32, 0.98]` per un effetto "snappy" ma fluido.
- **Configurazione**: Supporta `delay` e `duration` programmabili, con un offset di `-100px` per attivare l'animazione leggermente prima che l'elemento entri pienamente nel viewport.

### Micro-interazioni (Navigazione)
**Percorso:** `src/components/layout/Header.tsx`
**Ruolo:** Animazione della "bolla" di navigazione.

**Descrizione:**
La bolla che segue le voci di menu è gestita tramite transizioni CSS e `ResizeObserver`. 
- **Logica**: Viene calcolata la posizione esatta tramite `getBoundingClientRect` e applicata come coordinate assolute a un elemento div (bolla) con transizioni accelerate via hardware.

## Punti di attenzione
- **Performance**: Le animazioni che coinvolgono trasformazioni 3D o filtri (blur) sono monitorate per evitare cali di frame rate, specialmente su dispositivi mobili.
- **Reduced Motion**: Si raccomanda di implementare controlli per rispettare le preferenze di sistema `prefers-reduced-motion`.

## Vedi anche
- [[interfaccia-utente]] — torna alla panoramica dell'area
- [[tematizzazione-branding]] — interazione tra motion e design visivo
