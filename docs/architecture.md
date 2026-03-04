# Architecture

> **Nota:** Questo file descrive l'architettura tecnica del sistema.
> Ogni agente deve aggiornarlo ogni volta che introduce una nuova entità, route, o pattern strutturale.

---

## Stack Overview

| Layer | Tecnologia | Note |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server Components di default |
| Database | Supabase (PostgreSQL) | RLS abilitato su ogni tabella |
| Auth | Supabase Auth | Provider: email/magic link |
| Styling | Tailwind CSS + shadcn/ui | Tema custom in `tailwind.config.ts` |
| 3D Visualization | Three.js | Sfera Semantica — componente client isolato |
| State | URL state + React Context (globale) | No Zustand, no Redux |
| Type Safety | TypeScript strict | Tipi generati da Supabase CLI |

---

## Folder Structure

```
src/
├── app/                        # App Router — route e layout
│   ├── (auth)/                 # Route group: login, onboarding
│   │   ├── login/page.tsx
│   │   └── onboarding/page.tsx # Form psicografico "Pilastri del Gusto"
│   ├── (app)/                  # Route group: app autenticata
│   │   ├── layout.tsx          # Shell autenticata con nav
│   │   ├── sphere/page.tsx     # Sfera Semantica (main view)
│   │   └── film/[id]/page.tsx  # Dettaglio film
│   ├── actions/                # Server Actions
│   │   ├── profile.ts          # updateProfile, savePillars
│   │   ├── graph.ts            # getRecommendations, getEditorialGraph
│   │   └── films.ts            # getFilmById, searchFilms
│   └── api/                    # Route handlers (solo se necessario)
│
├── components/
│   ├── ui/                     # shadcn/ui components (non modificare)
│   ├── sphere/                 # Componenti 3D Sfera Semantica
│   │   ├── SemanticSphere.tsx  # Wrapper Client Component
│   │   ├── SphereScene.ts      # Logica Three.js (non React)
│   │   └── NodeLabels.tsx      # HTML labels overlay
│   ├── onboarding/             # Form psicografico
│   │   └── PillarForm.tsx
│   └── shared/                 # Componenti condivisi
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # createBrowserClient()
│   │   ├── server.ts           # createServerClient() per Server Components
│   │   └── middleware.ts       # createMiddlewareClient()
│   ├── graph/
│   │   ├── traversal.ts        # Algoritmo di navigazione del grafo
│   │   └── scoring.ts          # Scoring nodi in base ai pilastri
│   └── utils.ts                # cn(), helpers generici
│
├── types/
│   ├── supabase.ts             # Generato da CLI — NON editare manualmente
│   └── domain.ts               # Tipi di dominio: Film, Edge, Pillar, etc.
│
└── middleware.ts               # Protezione route autenticate
```

---

## Data Model (Supabase)

### `films`
| Colonna | Tipo | Note |
|---|---|---|
| id | uuid | PK |
| title | text | |
| year | int4 | |
| director | text | |
| synopsis | text | |
| poster_url | text | |
| created_at | timestamptz | |

### `editorial_edges`
| Colonna | Tipo | Note |
|---|---|---|
| id | uuid | PK |
| from_film_id | uuid | FK → films.id |
| to_film_id | uuid | FK → films.id |
| type | text | `thematic` \| `stylistic` \| `contrast` |
| label | text | Descrizione editoriale della connessione |
| weight | float4 | Forza della connessione (0–1) |
| created_at | timestamptz | |

### `users` (estende auth.users)
| Colonna | Tipo | Note |
|---|---|---|
| id | uuid | PK = auth.users.id |
| display_name | text | |
| onboarding_complete | bool | default false |
| created_at | timestamptz | |

### `user_pillars`
| Colonna | Tipo | Note |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id |
| film_id | uuid | FK → films.id |
| rank | int4 | Ordine di preferenza (1 = più forte) |
| created_at | timestamptz | |

---

## Algorithm: Graph Traversal

Il motore di raccomandazione non filtra per metadati ma **naviga il grafo editoriale**.

```
Input: user_pillars (nodi-pilastro dell'utente)
Output: lista ordinata di film raccomandati con path editoriale

1. Carica i nodi-pilastro dell'utente (Shell 0).
2. Per ogni pilastro, esegui BFS sui nodi adiacenti (depth 1 → Shell 1).
3. Calcola uno score per ogni nodo Shell 1:
   score = Σ (edge.weight × pillar.rank_weight)
4. Estendi la traversal ai nodi Shell 2 (vicini dei vicini).
5. Deduplicazione e ranking finale per score.
6. Ritorna i percorsi completi (path) per ogni raccomandazione.
```

---

## Auth Flow

```
/ (public)
└── /login          → Supabase magic link
    └── /onboarding → Form Pilastri del Gusto (obbligatorio al primo accesso)
        └── /sphere → App principale (protetta da middleware)
```

Il middleware controlla `onboarding_complete` su ogni richiesta e reindirizza se necessario.
