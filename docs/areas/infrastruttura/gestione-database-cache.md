---
titolo: "Gestione Database e Cache"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: infrastruttura
---

# Gestione Database e Cache

## Panoramica
L'infrastruttura dati di nozapp combina un database relazionale (PostgreSQL via Supabase) per la persistenza a lungo termine e un database Redis (via Upstash) per operazioni ad alta velocità come il rate limiting.

## Analisi tecnica

### Database Relazionale (Supabase)
**Punti chiave:**
- **Schema**: Utilizza tabelle per `users` (profili), `films`, `cinemas` e `editorial_articles`.
- **Relazioni**: Le connessioni semantiche tra i contenuti sono mappate tramite ID numerici o slug, alimentando il grafo 3D.
- **Sicurezza (RLS)**: Le Row Level Security policies sono implementate a livello di DB per impedire l'accesso non autorizzato ai profili o ai grafi personalizzati.

### Rate Limiting e Cache (Upstash Redis)
**Percorso:** `src/lib/rate-limit.ts`
**Ruolo:** Protezione contro flood e scraping.

**Descrizione:**
Utilizza Redis per tenere traccia delle richieste per IP o identificativo utente. 
- **Finestre Scorrevoli**: Implementa finestre di throttling differenziate per percorsi API (60/min), percorsi Auth (5/15min) e percorsi Graph (10/h).
- **Integrazione Proxy**: Il ratelimiter è invocato direttamente dal `src/proxy.ts` prima di processare la richiesta.

## Punti di attenzione
- **Costi Redis**: Monitorare l'utilizzo di Upstash Redis, specialmente in caso di bot attack (gestiti comunque dal bot filtering nel proxy).
- **Zod Schema**: La validazione dei tipi di ritorno dal DB deve essere garantita tramite i tipi generati da Supabase CLI in `src/types/supabase.ts`.

## Vedi anche
- [[infrastruttura]] — torna alla panoramica dell'area
- [[areas/architettura-core/configurazioni-globali]] — variabili d'ambiente per Redis/Supabase
