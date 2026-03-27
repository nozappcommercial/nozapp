---
tags: [#logic, #admin, #status/complete]
created: 2026-03-26
updated: 2026-03-26
---

# Sistema Editoriale e Gestione Admin

Il sistema editoriale di NoZapp permette alla sala stampa di creare e pubblicare articoli su temi cinematografici, integrandoli direttamente nell'esperienza della Sfera Semantica.

## Workflow Editoriale
Il workflow si basa su uno stato binario (`draft` | `published`) e sulla programmazione temporale.

- **Creazione**: Attraverso il form in `/admin/redazione/nuovo`. Viene generato automaticamente uno slug URL.
- **Preview**: Gli amministratori possono visualizzare l'articolo in anteprima all'indirizzo `/redazione/[slug]` anche se è in bozza.
- **Pubblicazione**: L'articolo diventa visibile al pubblico solo se `status = published` e la data corrente è compresa tra `published_at` e `expires_at`.

## Dashboard Admin (`/admin`)
La dashboard centrale funge da hub per:
- **Redazione**: Lista articoli con indicatori di stato (Bozza/Pubblicato/Scaduto).
- **Sicurezza**: Gestione del profilo e sessione MFA.

## Sicurezza: Multi-Factor Authentication (MFA)
Per proteggere l'area amministrativa, è stato implementato un secondo livello di sicurezza basato su Email OTP (One-Time Password) a 8 cifre.

### Flusso di Autenticazione
1. **Punto di Ingresso**: L'utente tenta di accedere a una rotta `/admin`. Il [[middleware]] intercetta la richiesta.
2. **Verifica Ruolo**: Viene controllato il flag `is_admin` nella tabella `users`.
3. **Verifica Sessione**: Se il cookie `admin_session` è assente, l'utente viene reindirizzato a `/admin/verify`.
4. **Invio Codice**: L'utente richiede un codice via Email (servizio nativo Supabase Auth). 
5. **Validazione**: Inserito il codice a 8 cifre corretto, viene impostato un cookie `httpOnly` sicuro della durata di 2 ore. L'utente ha anche l'opzione "Ho già un codice" per inserire un token precedentemente ricevuto senza generare un nuovo invio.

## Componenti Chiave
- `ArticleForm.tsx`: Componente client per il CRUD degli articoli.
- `EditorialSection.tsx`: Rendering degli articoli nella home page.
- `VerifyAdminPage.tsx`: Interfaccia per l'inserimento dell'OTP.

## Database Schema
Vedere [[database]] per il dettaglio della tabella `articles` e le nuove colonne MFA nella tabella `users`.

---
🔄 **Aggiornato il 2026-03-27**: Migrazione completa da SMS a Email MFA reale (8 cifre). Rimosso obbligo configurazione telefono e puliti campi obsoleti nel DB (`phone_number`, `otp_code`, `role`).
File modificati: `src/app/actions/admin_auth.ts`, `src/app/admin/verify/page.tsx`, `supabase/migrations/20260327000000_cleanup_users_table.sql`
