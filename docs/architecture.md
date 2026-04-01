---
tags: [#architecture, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Architettura Generale

[← Torna all'indice](./progetto.md)

## Visione d'Insieme
NoZapp adotta un'architettura **Full-stack moderna** basata su **Next.js 14** con l'utilizzo estensivo di **App Router**. Il progetto è strutturato per separare nettamente la visualizzazione 3D ad alte prestazioni dalla gestione dei dati e dell'autenticazione.

### Layer Architetturali
1. **UI Layer (Interaction)**: Composto da componenti React (Shadcn UI) e dal motore 3D (Three.js). Gestisce l'input utente e il feedback visivo.
2. **Logic Layer (Orchestration)**: Gestito tramite **Server Actions** e **Custom Hooks**. Include la logica di attraversamento del grafo semantico (`traversal.ts`).
3. **Data Layer (Persistence)**: Alimentato da **Supabase** (PostgreSQL) per i dati dinamici e da un **Dataset CSV** statico arricchito per la base di conoscenza dei film.

## Scelte Tecniche Chiave

### Next.js App Router
L'utilizzo dell'App Router permette una gestione granulare del **Server-Side Rendering (SSR)** e del **Client-Side Rendering (CSR)**:
- **Pagine e Layout**: In gran parte Server Components per massimizzare le performance e la SEO.
- **Interattività 3D**: Il componente `SemanticSphere` è contrassegnato con `"use client"` poiché richiede l'accesso a `window`, `document` e al ciclo di vita del browser per il rendering WebGL.

### Rendering Strategico
| Componente | Strategia | Rationale |
| :--- | :--- | :--- |
| **Sphere Page** | dynamic (force-dynamic) | Necessita di dati personalizzati in base all'utente loggato. |
| **Onboarding** | force-dynamic | Gestisce stati di sessione e database in tempo reale. |
| **API Admin** | Route Handlers | Utilizzate per operazioni CRON e bypass delle RLS via Service Role. |

## Diagramma dei Layer
```mermaid
graph TB
    subgraph Browser
        UI[React Components / Framer Motion]
        Engine[Three.js Semantic Sphere]
        Hooks[Client Hooks / State]
    end

    subgraph Server_NextJS
        SA[Server Actions]
        RH[Route Handlers / API]
        Proxy[Auth Proxy / Session Refresh]
    end

    subgraph Data
        Supabase[(Supabase DB & Auth)]
        CSV[Dataset CSV / TMDB Cache]
    end

    UI --> SA
    Engine --> Hooks
    Hooks --> SA
    SA --> Supabase
    RH --> Supabase
    SA --> CSV
    Proxy --> Supabase
```

## Flusso Generale dei Dati
1. L'**Auth Proxy** (ex middleware) intercetta la richiesta e valida la sessione.
2. La **Server Page** recupera il profilo utente e i dati del grafo da Supabase/CSV.
3. Lo **Sphere Engine** riceve i dati iniziali come props e costruisce la scena 3D.
4. Ogni interazione (like/seen) attiva una **Server Action** che aggiorna Supabase in tempo reale.

## Sicurezza Multi-livello

NoZapp adotta un approccio a più livelli per proteggere i dati e le funzionalità amministrative:

1. **Role-Based Access Control (RBAC)**: Utilizzo del campo `role` (`admin`, `redattore`, `analista`, `base`) nella tabella `users` per distinguere i poteri amministrativi.
2. **Row-Level Security (RLS)**: Le policy di Supabase (DB Level) garantiscono che solo utenti col ruolo adeguato possano modificare tabelle come `articles`, `cinema_movies` o `editorial_edges`.
3. **Multi-Factor Authentication (MFA)**: Un secondo livello di verifica tramite OTP (One-Time Password) è richiesto per accedere a qualsiasi risorsa sotto il path `/admin`. La sessione MFA è gestita tramite cookie sicuri `httpOnly`.

---
🔄 **Aggiornato il 2026-03-28**: Migrazione dal middleware tradizionale alla nuova convenzione **Proxy** di Next.js 16 (`src/proxy.ts`). Ristrutturazione del diagramma dei layer.

---
> [!TIP]
> Il progetto utilizza un approccio "Defense-in-Depth" per la sicurezza, coordinando RLS su Supabase, MFA nel middleware e validazione Zod nelle API.

🔄 **Aggiornato il 2026-03-30**: Passaggio dai Google Fonts ai font locali **Geist Sans** e **Geist Mono** per garantire privacy, performance e un'estetica editoriale coerente. Tutte le variabili CSS tipo `--font-serif` sono state mappate su Geist.
File modificati: `src/app/layout.tsx`, `src/app/globals.css`

🔄 **Aggiornato il 2026-04-01**: Eliminato storicamente lo switch logico `is_admin` a implementazione di un completo sistema di RBAC con ruoli utente nativi mappati anche su regole RLS Postgres.
File modificati: `supabase/migrations/20260401000000_unify_roles.sql`, `src/types/supabase.ts`
