# Guida per Nuovi Collaboratori (Onboarding)

Benvenuto nel team di NoZapp! Se stai leggendo questo file, sei pronto per iniziare a contribuire al progetto.

## Prerequisiti

Assicurati di avere installato sul tuo sistema:
*   **Node.js** (versione 18 o superiore raccomandata).
*   **Python 3.9+** (per gli script del dataset).
*   **Git** configurato correttamente.
*   **VisiData** (consigliato per ispezionare i CSV).

## Setup Iniziale

1.  **Clona il Repository**:
    ```bash
    git clone https://github.com/nozappcommercial/nozapp.git
    cd nozapp
    ```
2.  **Installa le dipendenze**:
    ```bash
    npm install
    # Per Python
    cd scripts && python3 -m venv venv && source venv/bin/activate && pip install pandas requests tqdm
    ```
3.  **Configura le variabili d'ambiente**:
    Crea un file `.env.local` partendo da `.env.example` e chiedi al team le chiavi Supabase di sviluppo.

4.  **Avvia il server**:
    ```bash
    npm run dev
    ```

## Flusso di Lavoro

-   **Branching**: Crea sempre un nuovo branch per ogni feature (`feature/nome-feature`) o bugfix (`fix/nome-bug`).
-   **Commit**: Usa messaggi di commit chiari e in inglese (es. `feat: add new shell logic to sphere`).
-   **Pull Request**: Apri una PR verso il branch `main` e attendi la review di almeno un altro collaboratore.

## Consigli Utili

-   Se lavori sulla **Sfera 3D**, tieni aperto il pannello `Console` del browser: gli errori di Three.js possono non apparire nel terminale di Node.
-   Usa i componenti in `sandbox/` per testare nuove idee UI in un ambiente isolato prima di integrarle nell'app principale.

---
[← Torna all'indice](./index.md)
