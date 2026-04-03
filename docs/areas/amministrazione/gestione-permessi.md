---
titolo: "Gestione Permessi e MFA"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: amministrazione
---

# Gestione Permessi e MFA

## Panoramica
La sicurezza delle aree sensibili è garantita da un sistema a gerarchie (Ruoli) integrato con una verifica multi-fattore personalizzata.

## Analisi tecnica

### Gerarchia dei Ruoli
Definita nella tabella `users` tramite la colonna `role`:
1.  **Admin**: Accesso totale al sistema e alla gestione utenti.
2.  **Redattore**: Può accedere solo alle aree editoriali (`/admin/redazione`) e cinema.
3.  **Analista**: Può accedere solo all'area `/admin/analisi` e ai report grafici.
4.  **Base**: Nessun accesso all'area `/admin`.

### Flusso MFA (OTP)
**Percorso:** `src/app/actions/admin_auth.ts`
**Logica:**
- Quando un utente con ruolo elevato accede a `/admin`, il middleware controlla la presenza del cookie `admin_session`.
- Se mancante, l'utente viene reindirizzato a `/admin/verify`.
- Viene generato un codice OTP a 8 cifre (via `supabase.auth.signInWithOtp`) e inviato all'email dell'amministratore.
- Una volta verificato correttamente, viene settato un cookie HTTP-only (`verified`) con scadenza a 2 ore.

## Punti di attenzione
- **Master OTP**: In ambiente di sviluppo/emergenza, è presente una bypass (`MASTER_ADMIN_OTP`) configurabile via variabili d'ambiente.
- **Log di Sicurezza**: Ogni tentativo di accesso o fallimento MFA viene registrato tramite il `logger.ts` per monitoraggio postumo.

## Vedi anche
- [[amministrazione]] — torna alla panoramica dell'area
- [[areas/infrastruttura/supabase-ssr-integration]] — base auth del sistema
