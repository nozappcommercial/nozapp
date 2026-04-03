---
titolo: "Scripts e Configurazione"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: sviluppo-strumenti
---

# Scripts e Configurazione

## Panoramica
Il progetto include una suite di script di utilità per automatizzare compiti ripetitivi, migrazioni di dati e operazioni di manutenzione rapida del database.

## Analisi tecnica

### Utility Script
**Percorso:** `scripts/`
- **`seed_onboarding.py`**: Popolamento iniziale delle "sonde" (probe films) necessarie per il corretto funzionamento della wizard di benvenuto.
- **`reset_user.mjs`**: Utility per eliminare o resettare lo stato di onboarding di un utente specifico durante i test.
- **`bundle_for_ai.py`**: Strumento per aggregare i file del progetto in un unico output leggibile dagli agenti AI durante le sessioni di sviluppo.
- **`replace-colors.js`**: Automatizza l'aggiornamento massivo dei codici colore (es. passaggio da esadecimale a HSL) per il design system.

### Configurazione Progetto
- **Package Scripts**: Definiti in `package.json`. Includono comandi standard (`dev`, `build`, `start`) e integrazioni per i test (`vitest`).
- **ESLint/Prettier**: Configurazioni standard per mantenere la qualità del codice e la coerenza dello stile.

## Punti di attenzione
- **Venv Python**: Alcuni script richiedono un virtual environment configurato in `scripts/venv` per le dipendenze Python (es. pandas, supabase-py).

## Vedi anche
- [[sviluppo-strumenti]] — torna alla panoramica dell'area
- [[areas/architettura-core/configurazioni-globali]] — parametri z-env usati dagli script
