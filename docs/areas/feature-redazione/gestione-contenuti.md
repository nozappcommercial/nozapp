---
titolo: "Gestione Contenuti"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-redazione
---

# Gestione Contenuti

## Panoramica
La macroarea Redazione gestisce la creazione e l'esposizione di editoriali e articoli. I contenuti sono scritti in formato Markdown per massimizzare la flessibilità e salvati nel database Supabase.

## Analisi tecnica

### Recupero Dati (Editorial Actions)
**Percorso:** `src/app/actions/editorial.ts` (implied)
**Ruolo:** Fetch dei contenuti dal database.

**Descrizione:**
Le Server Actions recuperano gli articoli pubblicati filtrando per stato e data di pubblicazione. Gli articoli includono metadati come autore, cover image, slug e excerpt.

### Pagina di Redazione (Intro)
**Percorso:** `src/app/redazione/page.tsx`
**Ruolo:** Pagina istituzionale del collettivo.

**Descrizione:**
Presenta il team editoriale con un'estetica curata. Serve a umanizzare il brand e spiegare la filosofia dietro la selezione dei contenuti della sfera.

## Punti di attenzione
- **Markdown**: Il parser supporta estensioni GFM (GitHub Flavored Markdown) come tabelle e link automatici.
- **SEO**: Ogni pagina articolo genera metadati dinamici basati sul titolo e l'excerpt dell'articolo.

## Vedi anche
- [[feature-redazione]] — torna alla panoramica dell'area
- [[visualizzazione-articoli]] — come il markdown viene renderizzato
