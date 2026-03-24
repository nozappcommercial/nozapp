# API, Route Handlers e Server Actions

NoZapp sfrutta le funzionalità server-side di Next.js per gestire la comunicazione sicura con il database e le API esterne.

## Server Actions

Le Server Actions sono il metodo preferito per le mutazioni di dati e le interazioni utente.

### `upsertMovieInteraction`
*   **Percorso**: `src/app/actions/movies.ts`
*   **Scopo**: Registra il feedback dell'utente su un film (Visto, Piaciuto, Ignorato).
*   **Logica**:
    1. Verifica l'autenticazione tramite Supabase Auth.
    2. Esegue un `upsert` o un `delete` nella tabella `user_film_interactions`.
    3. Scatena la `revalidatePath('/sphere')` per aggiornare i colori dei nodi nella scena 3D.

## Route Handlers (API REST)

| Metodo | Percorso | Scopo | Parametri |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/onboarding` | Completa il profilo utente | `display_name`, `pillars` |
| `GET` | `/api/admin/seed` | (Interno) Inizializza il database | - |

## Integrazione TMDB API

L'applicazione integra le API di **The Movie Database (TMDB)** per arricchire i dati grezzi del CSV.

*   **Endpoint Usati**:
    *   `GET /search/movie`: Per trovare ID TMDB partendo dal titolo inglese.
    *   `GET /movie/{id}`: Per recuperare poster, sinossi in italiano e altri metadati.
*   **Strategia**:
    *   Le chiamate avvengono principalmente durante la fase di preprocessing del dataset.
    *   I risultati vengono salvati localmente nei CSV arricchiti o direttamente in Supabase per evitare latenza a runtime.

---
[← Torna all'indice](./index.md)
