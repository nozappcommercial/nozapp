updated: 2026-04-01
agent: aggiornatore
---

# API e Server Actions

[← Torna all'indice](./progetto.md)

## Route Handlers (`app/api/`)
I Route Handlers gestiscono richieste HTTP esterne o operazioni di sistema che non rientrano nelle Server Actions.

### Onboarding
- **`POST /api/onboarding/complete`**: Valida e salva i risultati finali dell'onboarding (pilastri, abbonamenti, feedback, **birth_date**, **country**, **gender**). Utilizza **Zod** per la validazione dello schema.
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
- **`updateUserProfile`**: Aggiorna i dati demografici dell'utente (età, stato, sesso).

### Sistema Editoriale & Admin — `editorial.ts`, `admin_users.ts`, `admin_analytics.ts`, `editorial_edges.ts`
- **`upsertArticle`**: Crea o aggiorna un articolo della redazione.
- **`deleteArticle`**: Rimuove un articolo dal database.
- **`getPublishedArticles`**: Recupera gli articoli visibili al pubblico (attivi e non scaduti).
- **`getArchivedArticles`**: Recupera lo storico completo di tutti gli articoli (inclusi quelli scaduti) per la sezione Archivio.
- **`getArticleBySlug`**: Recupera un articolo specifico tramite lo slug URL (include bypass per preview admin).
- **`deleteUser`**: Eliminazione definitiva di un account utente (Auth + Database).
- **`updateUserRole`**: (NOVITÀ) Esegue l'aggiornamento protetto del campo `role` di un utente, subordinatamente alla verifica in-flight di un codice MFA valido.
- **`addEditorialEdge` / `deleteEditorialEdge`**: Creazione e rimozione visiva di link e relazioni ('tematico', 'stilistico', 'contrasto') tra film tramite pannello `/admin/collegamenti`.
- **`getDashboardAnalytics`**: Calcolo delle statistiche aggregate (età, provenienza, genere, interazioni). Utilizza `createAdminClient` per bypassare le policy RLS limitate.

### Autenticazione Admin (MFA) — `admin_auth.ts`
- **`generateAdminOTP`**: Richiede a Supabase di inviare un codice OTP via Email all'amministratore loggato.
- **`verifyAdminOTP`**: Valida il codice a 8 cifre e imposta il cookie di sessione sicura `admin_session`.
- **`updateAdminPhone`**: (Legacy) Precedentemente usato per la configurazione del telefono, ora non più richiesto per l'MFA via Email.

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

🔄 **Aggiornato il 2026-03-28**: Introdotta l'azione `getArchivedArticles`. Aggiornata `getDashboardAnalytics` per utilizzare il Service Role (Admin Client) garantendo statistiche precise su tutto il database.
File modificati: `src/app/actions/editorial.ts`, `src/app/actions/admin_analytics.ts`

🔄 **Aggiornato il 2026-04-01**: Inserita la nuova Action `updateUserRole` che va a rimpiazzare il toggle bool `is_admin`, integrando controllo sincrono dell'OTP. Aggiunte actions per CRUD su `editorial_edges.ts`.
File modificati: `src/app/actions/admin_users.ts`, `src/app/actions/editorial_edges.ts`
