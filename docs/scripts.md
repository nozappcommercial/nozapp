# Script e Comandi

NoZapp include diversi script per l'automazione della gestione dei dati, del database e della preparazione dell'ambiente AI.

## Script npm (package.json)

| Comando | Operazione |
| :--- | :--- |
| `npm run dev` | Avvia il server di sviluppo Next.js su `0.0.0.0`. |
| `npm run build` | Compila l'applicazione per la produzione. |
| `npm run start` | Avvia l'applicazione compilata. |
| `npm run lint` | Esegue il controllo della qualità del codice. |
| `npm run test` | Esegue i test unitari con Vitest. |

## Script di Sistema (`scripts/`)

Gli script nella cartella principale sono divisi per area funzionale.

### Pipeline Dati & Wikidata
*   **`scripts/title-it.py`**: Traduce i titoli dei film tramite Wikidata SPARQL. Supporta cache e batching.
*   **`scripts/title-conversion/script.py`**: Altre utility per la manipolazione dei file CSV del dataset.

### Gestione Supabase
*   **`scripts/test_db.mjs`**: Testa la connessione e le query base al database.
*   **`scripts/seed_onboarding.py`**: Popola i dati necessari per testare il flusso di onboarding degli utenti.
*   **`scripts/reset_user.mjs`**: Ripristina lo stato di un utente per test ricorsivi.

### Utility IA & Refactoring
*   **`scripts/bundle_for_ai.py`**: Crea un bundle compatto del codice sorgente da fornire a modelli di linguaggio (come Claude o GPT) per analisi del codice.
*   **`scripts/convert_to_react.js`**: Aiuta nella migrazione di vecchi script vanilla JS verso componenti React.
*   **`scripts/replace-colors.js`**: Automatizza la sostituzione dei codici colore hardcoded con variabili CSS/Tailwind.

## Python Environment
Molti script (`.py`) richiedono un virtual environment.
```bash
cd scripts
python3 -m venv venv
source venv/bin/activate
pip install -r title-conversion/requirements.txt
```

---
[← Torna all'indice](./index.md)
