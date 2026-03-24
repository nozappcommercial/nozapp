# Configurazione e Ambiente

Questa pagina descrive come configurare l'ambiente di sviluppo per NoZapp.

## File di Configurazione

1.  **`next.config.mjs`**:
    *   Configura i domini per le immagini esterne (`images.unsplash.com`, `a.ltrbxd.com`).
    *   Definisce le Content Security Policy (CSP) per permettere l'esecuzione di script Three.js e frame di YouTube.
2.  **`tsconfig.json`**:
    *   Definisce l'alias `@/*` per la cartella `src/`.
    *   Include il plugin di Next.js per il controllo dei tipi durante lo sviluppo.
3.  **`tailwind.config.ts`**:
    *   Personalizza i colori del tema (basati su variabili HSL).
    *   Include il plugin `tailwindcss-animate`.

## Variabili d'Ambiente (`.env`)

Copia il file `.env.example` in `.env.local` e compila i seguenti campi:

| Variabile | Scopo |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Endpoint del progetto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chiave pubblica per l'accesso client. |
| `SUPABASE_SERVICE_ROLE_KEY` | Chiave di sistema per operazioni amministrative. |
| `CRON_SECRET` | Token per proteggere le rotte di aggiornamento scheduled. |
| `RAPIDAPI_KEY` | (Opzionale) Per l'integrazione con provider di dati terzi. |

## Setup Locale in SSD Esterno

Nota: Il progetto è ottimizzato per essere eseguito da un workspace su disco esterno:
`/Volumes/Crucial/workspace/web/nozapp`

Se si verificano problemi di permessi o di velocità nel caricamento dei file `node_modules`, assicurarsi che il disco sia formattato in **APFS** o **Mac OS Extended**.

---
[← Torna all'indice](./index.md)
