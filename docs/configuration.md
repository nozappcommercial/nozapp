---
tags: [#config, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Configurazione e Ambiente

[← Torna all'indice](./progetto.md)

## File di Configurazione
NoZapp utilizza i file standard dell'ecosistema Next.js per la configurazione del build e del runtime.

### `next.config.mjs`
Configura le policy di sicurezza (CSP) e le ottimizzazioni delle immagini.
- **CSP**: Configura i domini autorizzati per recuperare poster (es. `image.tmdb.org`) e script esterni.
- **Headers**: Imposta header di sicurezza come `X-Frame-Options` e `Referrer-Policy`.

### `tsconfig.json`
Definisce gli alias di percorso (Path Aliases):
- `@/*`: Punta alla cartella `src/*`.
- Configura il supporto per JSX e le feature sperimentali dei decorator (se usate).

### `tailwind.config.ts`
Estende il tema di base con:
- Font custom (`cormorant`, `fragment`).
- Colori HSL mappati alle variabili di `globals.css`.
- Animazioni personalizzate (es. pulse e accordion).

## Variabili d'Ambiente
Ciascuna variabile deve essere definita in un file `.env.local` (per lo sviluppo) o nelle impostazioni di Vercel/Produzione.

| Variabile | Scopo | Esempio / Formato |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL dell'istanza Supabase. | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chiave pubblica anonima. | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Chiave segreta (solo server). | `eyJhbG...` |
| `TMDB_API_KEY` | Chiave API per arricchimento titoli. | `...` |
| `UPSTASH_REDIS_REST_URL` | Endpoint per rate-limiting. | `https://...` |
| `UPSTASH_REDIS_REST_TOKEN` | Token per rate-limiting. | `...` |
| `CRON_SECRET` | Segreto per proteggere i cron job. | `...` |

## Setup Ambiente di Sviluppo
Per avviare il progetto da zero:
1. Installa Node.js 18 o superiore.
2. Clona la repository in `/Volumes/Crucial/workspace/web/nozapp`.
3. Installa le dipendenze con `npm install`.
4. Configura il file `.env.local` partendo da `.env.example`.
5. Avvia il server di sviluppo: `npm run dev`.

---
> [!CAUTION]
> Non includere mai variabili d'ambiente reali (segreti) nei file `.md` o nel sistema di controllo versione (Git).
