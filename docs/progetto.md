---
tags: [#skeleton, #status/complete]
created: 2026-03-26
agent: scrittore
---

# NoZapp — Indice Generale

[← Torna all'indice](../../README.md)

## Panoramica di NoZapp
**NoZapp** è una web application sperimentale per l'esplorazione del gusto cinematografico. Attraverso una **Sfera Semantica 3D**, l'utente può navigare una costellazione di film connessi da relazioni tematiche, stilistiche e sensoriali.

**Stack Tecnologico Core**:
- **Framework**: Next.js 14 (App Router)
- **3D Engine**: Three.js (standard, non R3F)
- **Backend / Auth**: Supabase (PostgreSQL + SSR Auth)
- **Data Pipeline**: Python (Enrichment con Wikidata SPARQL)
- **Styling**: Tailwind CSS + Framer Motion
- **API Esterne**: TMDB (The Movie Database) per arricchimento titoli e metadati.

## Documentazione Tecnica

### Fondamenta
- [[architecture]] — Visione d'insieme e scelte architetturali chiave.
- [[project-structure]] — Albero delle cartelle e convenzioni di naming.
- [[configuration]] — File di configurazione e variabili d'ambiente.
- [[dependencies]] — Elenco e ruolo delle dipendenze principali.
- [[security]] — Audit Log, MFA e criteri di sicurezza dell'area admin.


### Logica e UI
- [[pages-and-routing]] — Mappa delle rotte e strategie di rendering.
- [[components]] — Dettaglio dei componenti React e pulsanti navigazione.
- [[three-js]] — Il motore 3D: `SemanticSphere`, geometrie e performance.
- [[hooks-and-utilities]] — Custom hook e helper di sistema.
- [[types]] — Definition Type e interfacce TypeScript.
- [[editorial-system]] — Gestione articoli, workflow redazione e dashboard admin.

### Dati e Integrazioni
- [[dataset]] — Pipeline CSV e arricchimento titoli (Wikidata).
- [[api]] — Guida a Route Handlers e Server Actions.
- [[data-flow]] — Come i dati viaggiano dal CSV alla sfera 3D.
- [[scripts]] — Comandi npm e tool Python di utilità.

### Supporto
- [[known-issues]] — Bug noti, TODO e limitazioni tecniche.
- [[onboarding-guide]] — Guida rapida per nuovi sviluppatori.

## Memoria Sessioni
- [[session-current]] — Diario di lavoro della sessione attiva.
- [[chat-history/2026-03-30/1509-onboarding-ui]] — Backup sessione Antigravity (Onboarding UI).
- [[chat-history/2026-03-30/1816-missing-history]] — Backup sessione Antigravity (Recupero History).

## Quick Start (Sviluppo Locale)

1. **Prerequisiti**: Node.js 18+, Python 3.10+ (opzionale per pipeline dati).
2. **Installazione**:
   ```bash
   npm install
   ```
3. **Configurazione**:
   Copia `.env.example` in `.env.local` e inserisci le chiavi Supabase e TMDB.
4. **Avvio**:
   ```bash
   npm run dev
   ```
5. **Visita**: `http://localhost:3000`

---
> ⚠️ Questa documentazione è generata automaticamente e riflette lo stato corrente del codebase.
