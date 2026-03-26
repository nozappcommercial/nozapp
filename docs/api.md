---
tags: [#api, #status/complete]
created: 2026-03-26
agent: scrittore
---

# API e Server Actions

[← Torna all'indice](./progetto.md)

## Route Handlers (`app/api/`)
I Route Handlers gestiscono richieste HTTP esterne o operazioni di sistema che non rientrano nelle Server Actions.

### Onboarding
- **`POST /api/onboarding/complete`**: Valida e salva i risultati finali dell'onboarding (pilastri, abbonamenti, feedback). Utilizza **Zod** per la validazione dello schema.
- **`POST /api/onboarding/reset`**: Resetta i dati dell'utente loggato, permettendogli di rifare il flusso iniziale.

### Admin & Cron
- **`GET /api/admin/sync-streaming`**: Sincronizza lo stato della disponibilità streaming dei film tramite **RapidAPI (Streaming Availability)**. Richiede un `CRON_SECRET` nell'header `Authorization`.

| Parametro | Descrizione | Default |
| :--- | :--- | :--- |
| `limit` | Numero massimo di film da sincronizzare. | 100 |
| `country` | Codice paese per la ricerca streaming. | `it` |

## Server Actions (`src/lib/actions/`)
Le Server Actions sono funzioni asincrone eseguite sul server, ma chiamate direttamente dai Client Components.

### Profilo e Interazioni — `profile_actions.ts`
- **`upsertMovieInteraction`**: Salva o aggiorna un feedback dell'utente (Like, Dislike, Seen, Ignore) su un determinato film.
- **`getPersonalizedGraph`**: Recupera i nodi e gli archi che compongono la sfera personalizzata dell'utente, basandosi sui suoi pilastri e affinità.
- **`updateUserStreaming`**: Aggiorna l'elenco delle piattaforme streaming sottoscritte.

## Integrazione TMDB API

NoZapp utilizza le API di **The Movie Database (TMDB)** per arricchire i metadati e gestire i titoli in italiano.

- **Endpoint Usati**:
    - `GET /search/movie`: Ricerca film per titolo e anno.
    - `GET /movie/{id}`: Recupero dettagli (credits, overview, poster).
- **Strategia**:
    - **Batching**: Gli arricchimenti massivi avvengono tramite script Python (`dataset/scripts/title-it.py`).
    - **Caching**: I risultati vengono salvati localmente per minimizzare le chiamate e rispettare i rate limit di TMDB.

---

## Sicurezza API
Tutte le API e le Actions implementano:
1. **Validazione con Zod**: Gli input sono rigorosamente tipizzati.
2. **Rate Limiting**: Protezione tramite Upstash Redis (`src/lib/rate-limit.ts`).
3. **Audit Log**: Ogni operazione sensibile viene registrata tramite `logSecurityEvent`.

---
> [!IMPORTANT]
> Non esporre mai le API Key (`TMDB_API_KEY`, `RAPIDAPI_KEY`) sul lato client. Devono essere utilizzate esclusivamente in ambiente server.
