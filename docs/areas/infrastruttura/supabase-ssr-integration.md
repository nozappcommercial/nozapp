---
titolo: "Integrazione Supabase SSR"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: infrastruttura
---

# Integrazione Supabase SSR

## Panoramica
nozapp utilizza il pacchetto `@supabase/ssr` per gestire l'autenticazione e l'accesso ai dati in modo sicuro sia dal client che dal server (Server Components, Server Actions, Middleware).

## Analisi tecnica

### Configurazione Client/Server
**Percorso:** `src/lib/supabase/`
- **`client.ts`**: Crea un client per il browser utilizzando le variabili d'ambiente pubbliche.
- **`server.ts`**: Crea un client lato server che gestisce automaticamente la persistenza della sessione tramite i cookie di Next.js. Include logica di gestione errori per i casi in cui i cookie non possono essere scritti (es. durante il rendering di un Server Component).

### Middleware e Sincronizzazione
**Percorso:** `src/lib/supabase/middleware.ts`
**Ruolo:** Refresh della sessione e protezione rotte.

**Descrizione:**
Il middleware intercetta ogni richiesta per assicurarsi che il token di autenticazione sia valido. Se il token sta per scadere, il client Supabase SSR tenta di rinfrescarlo e aggiorna i cookie di risposta. In caso di fallimento, l'utente viene reindirizzato alla pagina di login.

## Punti di attenzione
- **Server Actions**: Tutte le Server Actions che interagiscono con il DB devono utilizzare il client creato da `server.ts` per garantire che l'identità dell'utente sia verificata correttamente.
- **Performance**: Poiché il middleware viene eseguito su ogni richiesta, è fondamentale mantenerlo snello per non aumentare la latenza TTFB.

## Vedi anche
- [[infrastruttura]] — torna alla panoramica dell'area
- [[areas/autenticazione/integrazione-supabase-auth]] — configurazione dei provider
