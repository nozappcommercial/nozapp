---
date: 2026-03-28
status: active
---

## 17:20 [tipo: bug-fix]

**File toccati**:

- `src/components/admin/AdminHeader.tsx` — Implementata la chiamata `router.refresh()` nel tasto refresh per forzare la ricarica dei Server Components.
- `src/app/admin/analisi/page.tsx` — Aggiunto listener per l'evento di refresh globale per ricaricare le statistiche via client.
- `src/app/admin/cinema/page.tsx` — Aggiunto listener per ricaricare la lista film in tempo reale.

**Problema di partenza**: Il tasto refresh nell'header admin funzionava solo sulla pagina Utenti. Nelle altre sezioni era puramente estetico (non triggerava alcuna azione).
**Soluzione applicata**: Centralizzata la logica di refresh nell'header (mix tra `router.refresh()` per componenti server e `CustomEvent` per componenti client) e registrati i listener necessari nelle varie dashboard.
**Side effects**: Nessuno. Ora l'intera area admin risponde correttamente al comando di ricarica senza dover ricaricare l'intero browser.

---

## 17:25 [tipo: bug-fix]

**File toccati**:

- `src/app/actions/admin_analytics.ts` — Migrata la logica di recupero dati dal client standard (`anon`) al client `admin` (service_role) per bypassare le policy RLS e visualizzare correttamente il conteggio totale degli utenti. Aggiunta verifica esplicita del ruolo admin per sicurezza.

**Problema di partenza**: La Dashboard e la pagina Analisi mostravano solo 1 utente iscritto, nonostante su Supabase ne fossero presenti 3. Questo accadeva perché il client utilizzato rispettava le restrizioni RLS, limitando la vista ai soli dati dell'utente loggato.
**Soluzione applicata**: Implementato l'uso di `createAdminClient()` all'interno della Server Action `getDashboardAnalytics`, garantendo che le statistiche aggregate riflettano l'intero database.
**Side effects**: Nessuno. La sicurezza è garantita dal check preliminare `is_admin` sull'ID dell'utente che effettua la richiesta.

---
