---
tags: [#dataset, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Dataset e Pipeline Dati

[← Torna all'indice](./progetto.md)

## Il File Sorgente: `movies.csv`
NoZapp si basa su un dataset massivo di film (~900K righe) derivato originariamente da Kaggle (Letterboxd).
- **Percorso**: `dataset/movies.csv`
- **Contenuto**: Dati grezzi (titolo EN, anno, descrizione, generi, studio, attori).

| Colonna | Tipo | Descrizione |
| :--- | :--- | :--- |
| `id` | `int` | ID univoco del film (Letterboxd). |
| `name` | `string` | Titolo originale del film (tipicamente inglese). |
| `date` | `int` | Anno di uscita del film. |
| `tagline` | `string` | Slogan del film. |
| `description` | `text` | Sinossi breve. |
| `minute` | `int` | Durata in minuti. |
| `rating` | `float` | Voto utente (0-5). |

## Pipeline di Arricchimento

### 1. Traduzione Titoli (`title-it.py`)
Poiché il dataset originale è in inglese, NoZapp utilizza uno script Python per recuperare i titoli italiani ufficiali.
- **Strategia**: Interrogazione **Wikidata SPARQL**.
- **Flusso**:
    1. Cerca il film per titolo inglese e anno su Wikidata.
    2. Estrae la label italiana (`rdfs:label` con `FILTER(LANG(?titleIT) = "it")`).
    3. Aggiorna il file con la colonna `title_it`.
- **Output**: `dataset/movies_with_italian_titles.csv`.

### 2. Merging e Denormalizzazione (`merge_dataset.py`)
Unisce `movies.csv` con CSV secondari (`actors.csv`, `genres.csv`, `posters.csv`, `themes.csv`).
- **Filtro**: Vengono mantenuti solo i film prodotti dopo il 1990 (default).
- **Output**: `dataset/output/films-merged.jsonl` (formato JSON Lines ottimizzato per il seed).

### 3. Importazione su Supabase (`seed_supabase.py`)
Esegue l'importazione bulk nel database PostgreSQL.
- **Metodo**: `upsert` a batch (3000 record alla volta) bypassando le RLS tramite il **Service Role Key**.

## Ispezione e Manutenzione
Per ispezionare rapidamente il dataset CSV senza caricare pesanti fogli di calcolo, è consigliato l'uso di **VisiData**:
```bash
vd dataset/movies.csv
```
Questo permette di filtrare, ordinare e analizzare statisticamente i dati direttamente dal terminale.

---
> [!IMPORTANT]
> Non modificare manualmente `movies.csv`. Ogni modifica strutturale deve passare attraverso gli script della pipeline per garantire la coerenza tra i file locali e il database.
