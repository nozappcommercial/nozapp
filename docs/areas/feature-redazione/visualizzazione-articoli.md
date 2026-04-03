---
titolo: "Visualizzazione Articoli"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-redazione
---

# Visualizzazione Articoli

## Panoramica
L'esperienza di lettura in nozapp è progettata per essere immersiva e priva di distrazioni, richiamando l'eleganza di una rivista cartacea di alta qualità.

## Analisi tecnica

### Rendering Markdown
**Percorso:** `src/app/redazione/[slug]/page.tsx`
**Ruolo:** Layout dinamico dell'articolo.

**Descrizione:**
Utilizza `react-markdown` configurato con temi Tailwind Typography (`prose`).
- **Typography**: Carattere serif (Cormorant Garamond) per il corpo del testo, con ampi margini e interlinea generosa.
- **Reading Time**: Calcolato dinamicamente lato server in base al numero di parole (`words / 200`).

### Sezione Editoriale Home
**Percorso:** `src/components/home/EditorialSection.tsx`
**Ruolo:** Teaser degli articoli sulla homepage.

**Descrizione:**
Una griglia di card animate che mostrano il titolo, l'estratto e l'immagine di copertina. Utilizza `IntersectionObserver` per triggerare un'animazione di ingresso "fade-up" quando l'utente scorre fino alla sezione.

## Punti di attenzione
- **Immagini**: Le immagini di copertina utilizzano il componente `next/image` con priorità per il caricamento sopra la piega, ottimizzando le performance LCP.

## Vedi anche
- [[feature-redazione]] — torna alla panoramica dell'area
- [[gestione-contenuti]] — origine dei dati visualizzati
