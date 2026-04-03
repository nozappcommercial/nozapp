---
titolo: "Index — Infrastruttura & Backend"
tipo: index
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: infrastruttura
---

# Infrastruttura & Backend

## Scopo e responsabilità
Include tutta la logica "low-level" che permette al sistema di funzionare: database, integrazioni terze parti, gestione API server-side, rate limiting e sicurezza.

## File che compongono questa area
- `supabase/` — Cartella CLI per la gestione di migrations e configurazione database
- `src/app/api/` — Route API REST interne (Route Handlers di Next.js)
- `src/lib/supabase/` — Inizializzazione client (browser vs server) e helper SSR
- `src/lib/rate-limit.ts` — Middleware per il controllo delle chiamate (Upstash)

## Sezioni di approfondimento
> Questi file verranno generati dall'Agente Relatore

- [[supabase-ssr-integration]] — SSR, Session management e Middleware
- [[gestione-database-cache]] — PostgreSQL e Upstash Redis Rate limiting

## Dipendenze da altre macroaree
- [[areas/architettura-core/architettura-core]] — Utilizza le variabili d'ambiente caricate da `.env`

## Cronologia modifiche
(Inizialmente vuoto)
