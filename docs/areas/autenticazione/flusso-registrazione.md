---
titolo: "Flusso di Registrazione"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: autenticazione
---

# Flusso di Registrazione

## Panoramica
Il processo di ingresso in nozapp è progettato per essere fluido e visivamente appagante. Gestisce la creazione di nuovi account tramite email/password o social login, garantendo la validità dei dati e la protezione dai bot.

## Analisi tecnica

### Pagina di Autenticazione Unificata
**Percorso:** `src/app/(auth)/login/page.tsx`
**Ruolo:** Gestore unico del front-end per l'accesso.

**Descrizione:**
La pagina utilizza uno stato locale (`view`) per alternare tra diverse maschere: `login`, `register`, `reset`, e `update-password`.
- **Registrazione**: Richiede Email, Password (con conferma) e Username. I dati vengono inviati a `supabase.auth.signUp`.
- **Validazione**: Implementa controlli lato client su formato email e complessità password (minimo 8 caratteri).
- **Sicurezza Anti-Bot**: Include un campo "honeypot" (`website_url`) invisibile all'utente; se compilato, la richiesta viene bloccata e loggata come evento di sicurezza.

### Sincronizzazione Client-Side
**Percorso:** `src/components/auth/AuthHandler.tsx`
**Ruolo:** Gestore silenzioso dello stato di autenticazione.

**Descrizione:**
Componente invisibile montato nel layout radice che:
1. Ascolta eventi come `PASSWORD_RECOVERY` per forzare la visualizzazione della maschera di aggiornamento password.
2. Pulisce l'URL dai token sensibili (hash) dopo che Supabase li ha processati, per evitare che rimangano nella cronologia del browser.

## Punti di attenzione
- **Honeypot**: Fondamentale non rimuovere il campo nascosto nel form di registrazione per evitare spam di account bot.
- **Redirect post-registrazione**: Dopo il signup, viene mostrato un messaggio di conferma che invita a controllare l'email per la verifica (Double Opt-In).

## Vedi anche
- [[autenticazione]] — torna alla panoramica dell'area
- [[integrazione-supabase-auth]] — logica di comunicazione con il backend
