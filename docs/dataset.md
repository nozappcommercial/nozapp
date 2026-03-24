# Dataset e Pipeline Dati

Il patrimonio informativo di NoZapp si basa su un dataset esteso di circa 900.000 film, originariamente derivato da Kaggle.

## Struttura del Dataset CSV

Il file principale è `dataset/movies.csv`.

| Colonna | Tipo | Descrizione |
| :--- | :--- | :--- |
| `id` | Integer | Identificativo univoco del film. |
| `name` | String | Titolo originale in inglese. |
| `year` | Integer | Anno di uscita. |
| `director` | String | Nome del regista principale. |
| `title_it` | String | (Aggiunto) Titolo ufficiale in italiano. |
| `poster_url` | String | Link all'immagine del poster (estratto da TMDB/Letterboxd). |

## Pipeline di Arricchimento

Per rendere l'app fruibile al pubblico italiano, è stata implementata una pipeline di traduzione e arricchimento.

### Traduzione Titoli (Wikidata)
*   **Script**: `scripts/title-it.py`
*   **Processo**:
    1. Legge il titolo inglese (`name`).
    2. Interroga **Wikidata** via SPARQL cercando il label in italiano (`@it`).
    3. Se trovato, lo salva nella colonna `title_it`.
    4. Utilizza una **cache locale** (`wikidata_cache.json`) per saltare i titoli già elaborati.

### Lookup TMDB (Opzionale)
*   Utilizzato per recuperare sinossi e immagini dove mancanti nel dataset originale.
*   Gestito tramite gli script in `scripts/title-conversion/`.

## Strumenti di Ispezione

*   **VisiData**: Utilizzato durante lo sviluppo per esplorare velocemente i CSV giganti da terminale senza caricare interamente i file in memoria RAM.
*   **Supabase Dashboard**: Per la gestione e la validazione finale dei dati importati.

---
[← Torna all'indice](./index.md)
