---
titolo: "Integrazione Supabase Auth"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: autenticazione
---

# Integrazione Supabase Auth

## Panoramica
Nozapp utilizza Supabase Auth per la gestione sicura delle identità. L'integrazione segue il pattern SSR (Server-Side Rendering) per garantire che la sessione sia disponibile sia su client che su server tramite cookie.

## Analisi tecnica

### Client SSR
**Percorso:** `src/lib/supabase/server.ts`
**Ruolo:** Inizializzazione sicura del client Supabase lato server.

**Descrizione:**
Utilizza `@supabase/ssr` per mappare la gestione dei token sui cookie di Next.js. Implementa i metodi `get`, `set` e `remove` per sincronizzare lo stato della sessione tra le richieste HTTP e il middleware.

### Utility di Protezione Rotte
**Percorso:** `src/lib/auth-utils.ts`
**Ruolo:** Helper per la difesa delle risorse.

**Descrizione:**
Fornisce funzioni standardizzate per l'uso nei Server Components e nelle API:
- `ensureAuthenticated()`: Recupera l'utente corrente e lancia un errore se la sessione non è valida.
- `verifyOwnership(table, id)`: Verifica che la risorsa richiesta appartenga effettivamente all'utente loggato (confrontando il campo `user_id`).

### Callback OAuth
**Percorso:** `src/app/auth/callback/route.ts`
**Ruolo:** Scambio del codice di autenticazione per una sessione persistente.

**Descrizione:**
Punto di atterraggio per i flussi Google OAuth e per i link di conferma email. Converte il parametro `code` in una sessione Supabase e reindirizza l'utente alla destinazione finale (es. `/sphere`).

## Punti di attenzione
- **Service Role**: Non utilizzare mai la chiave `SUPABASE_SERVICE_ROLE_KEY` lato client; è riservata esclusivamente a operazioni amministrative lato server analizzate in `configurazioni-globali`.
- **Cookie Security**: La configurazione SSR assicura la protezione dai cross-site script (XSS) delegando la gestione dei token al layer dei cookie `httpOnly`.

## Vedi anche
- [[autenticazione]] — torna alla panoramica dell'area
- [[gestione-profili]] — come i dati utente vengono espansi
