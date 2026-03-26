---
tags: [#scripts, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Script e Comandi

[← Torna all'indice](./progetto.md)

## Script npm (`package.json`)
Comandi standard per il ciclo di vita dell'applicazione.

- **`npm run dev`**: Avvia il server di sviluppo Next.js su `http://localhost:3000`.
- **`npm run build`**: Compila l'applicazione per la produzione.
- **`npm run start`**: Avvia l'applicazione compilata in produzione.
- **`npm run lint`**: Esegue ESLint per verificare errori formali nel codice.
- **`npm run test`**: Esegue i test unitari tramite Vitest.

---

## Script Python (Pipeline Dati)
Presenti nella cartella `dataset/` e `scripts/`. Gestiscono il pre-processing massivo dei dati.

### `dataset/merge_dataset.py`
**Scopo**: Unisce i diversi CSV di Letterboxd in un unico file JSONL.
- **Input**: `movies.csv`, `actors.csv`, `genres.csv`, ecc.
- **Output**: `dataset/output/films-merged.jsonl`.
- **Uso**: `python dataset/merge_dataset.py --year 1990`.

### `dataset/seed_supabase.py`
**Scopo**: Importa i dati trasformati sul database Supabase.
- **Uso**: `python dataset/seed_supabase.py --batch 3000`.
- **Note**: Richiede `SUPABASE_SERVICE_ROLE_KEY` nel file `.env`.

### `scripts/title-it.py`
**Scopo**: Arricchisce i titoli dei film con le traduzioni ufficiali italiane.
- **Strategia**: Query SPARQL su Wikidata.
- **Uso**: `python scripts/title-it.py`.

---

## Utility JS/MJS (`scripts/`)
Script rapidi per test e manutenzione.

- **`test_db.mjs`**: Verifica la connessione e i permessi del database Supabase.
- **`check_probes.mjs`**: Verifica che ci siano abbastanza film sonda per il wizard di onboarding.
- **`replace-colors.js`**: Tool per aggiornare massivamente i colori dei nodi 3D in base ai temi.
- **`debug_onboarding.mjs`**: Simula i passaggi dell'onboarding per individuare bug logici.

---

## Comandi di Sistema Utili
- **VisiData**: Per ispezionare i CSV velocemente.
  ```bash
  vd dataset/movies.csv
  ```
- **Supabase CLI**: Per gestire migrazioni e generare tipi TypeScript.
  ```bash
  npx supabase gen types typescript --local > src/types/supabase.ts
  ```

---
> [!NOTE]
> Molti script Python richiedono l'installazione delle dipendenze contenute in un ambiente virtuale (`dataset/.venv` o `scripts/venv`).
