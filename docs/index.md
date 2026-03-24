# NoZapp — Indice Generale

Benvenuti nella documentazione ufficiale di **NoZapp**, un'applicazione web innovativa che permette l'esplorazione semantica di un vasto dataset cinematografico attraverso una visualizzazione 3D interattiva.

## Panoramica del Progetto

NoZapp combina la potenza di **Next.js 14** (App Router) con le capacità grafiche di **Three.js** per creare un'esperienza utente immersiva. L'applicazione organizza i film in "gusci" (shells) concentrici basati sulla loro rilevanza e connessioni tematiche, stilistiche o di contrasto.

### Stack Tecnologico
- **Framework**: Next.js 14 (App Router, Server Actions)
- **3D Engine**: Three.js (con integrazione React)
- **Linguaggio**: TypeScript
- **Staging/Database**: Supabase (Auth, DB)
- **Styling**: Tailwind CSS, CSS Modules
- **Animazioni**: Framer Motion, Anime.js
- **Dataset**: ~900K record arricchiti tramite TMDB API e Wikidata

## Documentazione Tematica

Naviga tra le diverse aree del progetto:

1. [**Architettura Generale**](./architecture.md) — Panoramica dei layer e delle strategie di rendering.
2. [**Struttura delle Cartelle**](./project-structure.md) — Organizzazione del workspace e convenzioni.
3. [**Componenti UI**](./components.md) — Documentazione dei componenti React standard.
4. [**Componenti e Scena 3D**](./three-js.md) — Dettagli sulla Sfera Semantica e Three.js.
5. [**Pagine e Routing**](./pages-and-routing.md) — Mappa delle rotte dell'App Router.
6. [**API e Server Actions**](./api.md) — Endpoint e logica server-side.
7. [**Dataset e Pipeline Dati**](./dataset.md) — Gestione dei dati e arricchimento Wikidata.
8. [**Flusso dei Dati**](./data-flow.md) — Come i dati si muovono nel sistema.
9. [**Hook e Utility**](./hooks-and-utilities.md) — Logica riutilizzabile e helper di sistema.
10. [**Tipi e Interfacce**](./types.md) — Definizioni TypeScript del progetto.
11. [**Configurazione e Ambiente**](./configuration.md) — Setup e variabili d'ambiente.
12. [**Dipendenze**](./dependencies.md) — Librerie esterne utilizzate.
13. [**Script e Comandi**](./scripts.md) — Guida agli script npm e Python.
14. [**Problemi Noti e TODO**](./known-issues.md) — Stato attuale e aree di miglioramento.
15. [**Onboarding per Sviluppatori**](./onboarding.md) — Guida rapida per iniziare a contribuire.

## Setup Rapido

Per avviare il progetto in locale:

```bash
# Installa le dipendenze
npm install

# Configura l'ambiente (copia .env.example)
cp .env.example .env.local

# Avvia il server di sviluppo
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`.

---
[← Torna all'indice](./index.md)
