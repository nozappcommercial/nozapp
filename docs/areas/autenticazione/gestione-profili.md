---
titolo: "Gestione Profili"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: autenticazione
---

# Gestione Profili

## Panoramica
Oltre alla semplice autenticazione, nozapp estende l'identità utente tramite una tabella `profiles` sincronizzata. Questa sezione descrive come vengono gestiti i dati aggiuntivi come il nome visualizzato, l'avatar e i permessi.

## Analisi tecnica

### Schema Database (Estensione)
Sebbene gestito dall'area Infrastruttura, il profilo è logicamente parte dell'Autenticazione. Ogni record in `auth.users` ha un corrispondente in `public.profiles`.

### Sincronizzazione Metadata
**Descrizione:**
Durante la registrazione (signup), nozapp invia il `display_name` come parte degli `user_metadata`.
```typescript
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { display_name: username }
  }
});
```
Un trigger lato database (Supabase) si occupa di creare automaticamente il record nel profilo pubblico al momento della conferma dell'email.

### Verifica Ownership
**Percorso:** `src/lib/auth-utils.ts`
**Ruolo:** Funzione `verifyOwnership`.

**Descrizione:**
La funzione garantisce che un utente possa modificare solo i propri dati. Controlla che il campo `user_id` nella tabella di destinazione corrisponda al `sub` (ID) dell'utente autenticato nella sessione corrente.

## Punti di attenzione
- **Data Privacy**: Le informazioni sensibili (email, password) rimangono nello schema privato di Supabase (`auth`), mentre solo i dati pubblici o necessari all'app risiedono in `public.profiles`.
- **RUOLI (Admin/User)**: I permessi sono attualmente gestiti tramite un campo `role` nella tabella profili, verificato lato server prima dell'accesso alle route di amministrazione.

## Vedi anche
- [[autenticazione]] — torna alla panoramica dell'area
- [[flusso-registrazione]] — entry point dei dati profilo
