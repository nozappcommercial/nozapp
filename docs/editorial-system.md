---
tags: [#logic, #admin, #status/complete]
created: 2026-03-26
updated: 2026-03-28
---

# Sistema Editoriale e Gestione Admin

Il sistema editoriale di NoZapp permette alla sala stampa di creare e pubblicare articoli su temi cinematografici, integrandoli direttamente nell'esperienza della Sfera Semantica.

## Workflow Editoriale
Il workflow si basa su uno stato binario (`draft` | `published`) e sulla programmazione temporale.

- **Creazione**: Attraverso il form in `/admin/redazione/nuovo`. Viene generato automaticamente uno slug URL. Supporta la sintassi **Markdown** (Gfm) per gli stili e le immagini.
- **Preview**: Gli amministratori possono visualizzare l'articolo in anteprima all'indirizzo `/redazione/[slug]` anche se è in bozza.
- **Archive Page**: La pagina `/archivio` elenca lo storico completo di tutti gli articoli pubblicati (inclusi quelli scaduti), fungendo da biblioteca digitale del progetto.
- **Redazione Information**: La rotta `/redazione` è stata consolidata per presentare la visione curatoriale del team e le informazioni istituzionali, migrando i contenuti dalla precedente rotta separata.
- **Reading Experience**: La pagina `/redazione/[slug]` adotta un design **Hero Title-first** ad alto impatto visivo (`min-h-[90vh]`). Il titolo occupa l'intero viewport iniziale con indicatori di scroll, svelando il contenuto solo tramite interazione consapevole. Il layout mantiene l'estetica "slow-web" con rendering Markdown, tipografia `Cormorant Garamond` e animazioni fade-in allo scroll per i media.
- **Navigazione**: Introdotto il componente `BackToTop` per facilitare il ritorno a inizio pagina dopo la lettura.
- **Pubblicazione**: L'articolo diventa visibile al pubblico solo se `status = published` e la data corrente è compresa tra `published_at` e `expires_at`.

## Dashboard Admin (`/admin`)
La dashboard centrale è stata evoluta in un sistema gestionale completo che include:
- **Redazione**: CRUD articoli con indicatori di stato (Bozza/Pubblicato/Scaduto) e vista responsive a card per mobile.
- **Utenti**: Monitoraggio degli iscritti, filtri demografici (età, provenienza, sesso) e gestione permessi admin con possibilità di eliminazione account.
- **Analisi**: Dashboard dinamica con grafici statistici sull'engagement e sulla distribuzione demografica degli utenti.
- **System Vitals**: Modulo avanzato per il monitoraggio tecnico in tempo reale (latenza API, stato cache, indicatori di build success).
- **Cinema**: Gestione manuale del carosello pubblico "Ora al Cinema" con supporto per le date di scadenza.
- **Sicurezza**: Gestione del profilo e sessione MFA via Email OTP.

## Gestione Cinema (Manuale)
A differenza del resto della Sfera Semantica (che è dinamica), la sezione Cinema è curata manualmente dagli amministratori per garantire il lancio di titoli specifici o promozioni.

- **Campi**: Titolo, Regista, Anno, URL Poster, Temi (Tag), Data di Scadenza.
- **Automazione**: Il sistema nasconde automaticamente i film dal carosello pubblico non appena viene superata la `expires_at`.
- **Integrazione**: I dati sono recuperati tramite la Server Action `getCinemaMoviesPublic` che filtra i record scaduti.

## Sicurezza: Multi-Factor Authentication (MFA)
Per proteggere l'area amministrativa, è stato implementato un secondo livello di sicurezza basato su Email OTP (One-Time Password) a 8 cifre.

### Flusso di Autenticazione
1. **Punto di Ingresso**: L'utente tenta di accedere a una rotta `/admin`. Il [[middleware]] intercetta la richiesta.
2. **Verifica Ruolo**: Viene controllato il flag `is_admin` nella tabella `users`.
3. **Verifica Sessione**: Se il cookie `admin_session` è assente, l'utente viene reindirizzato a `/admin/verify`.
4. **Invio Codice**: L'utente richiede un codice via Email (servizio nativo Supabase Auth). 
5. **Validazione**: Inserito il codice a 8 cifre corretto, viene impostato un cookie `httpOnly` sicuro della durata di 2 ore. L'utente ha anche l'opzione "Ho già un codice" per inserire un token precedentemente ricevuto senza generare un nuovo invio.
6. **Logout**: La disconnessione avviene tramite Server Action (`logoutAdmin`) che invalida la sessione Supabase e rimuove il cookie `admin_session` per prevenire loop di redirect.

## Audit e Logging di Sicurezza
Tutti gli eventi critici per la sicurezza della piattaforma vengono tracciati tramite un logger centralizzato (`src/lib/logger.ts`).

- **Destinazione**: I log vengono stampati sulla console del server e salvati nella tabella `security_logs` (solo in produzione o se abilitato esplicitamente).
- **Eventi Tracciati**:
    - Tentativi di accesso (successo/fallimento).
    - Blocchi per Rate Limiting.
    - Rilevamento Bot e Crawler malevoli.
    - Errori API critici e traffico sospetto.
- **Accesso**: I log sono consultabili direttamente dal database Supabase dagli amministratori.

## Componenti Chiave
- `ArticleForm.tsx`: Componente client per il CRUD degli articoli.
- `EditorialSection.tsx`: Rendering degli articoli nella home page.
- `VerifyAdminPage.tsx`: Interfaccia per l'inserimento dell'OTP.

## Database Schema
Vedere [[database]] per il dettaglio della tabella `articles` e le nuove colonne MFA nella tabella `users`.

---
🔄 **Aggiornato il 2026-03-28**: Riprogettato il template articolo con sezioni Hero a tutto schermo e indicatori di scroll. Consolidata la rotta `/redazione` e implementata l'azione `getArchivedArticles` per la nuova pagina Archivio. Ottimizzato il refresh dei dati nell'area admin.
File modificati: `src/app/redazione/[slug]/page.tsx`, `src/app/redazione/page.tsx`, `src/app/archivio/page.tsx`, `src/app/actions/editorial.ts`, `src/components/admin/AdminHeader.tsx`
