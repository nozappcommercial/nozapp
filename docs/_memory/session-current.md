---
date: 2026-03-27
status: active
---
## [10:24] [tipo: refactor]

**File toccati**:

- `supabase/migrations/20260327000000_cleanup_users_table.sql` — [Creazione migrazione per rimuovere role, phone_number, otp_code]
- `src/app/actions/admin_auth.ts` — [Rimozione updateAdminPhone e riferimenti a phone_number]
- `src/app/admin/verify/page.tsx` — [Rimozione logica e UI per setup telefono (MFA ora solo via Email)]
- `src/types/supabase.ts` — [Sincronizzazione tipi TypeScript con il nuovo schema]
- `docs/types.md` — [Aggiornamento documentazione tabella users]
- `docs/editorial-system.md` — [Aggiornamento note sul flusso MFA]

**Problema di partenza**: Presenza di campi ridondanti (role vs is_admin) e obsoleti (SMS MFA) nella tabella users.
**Soluzione applicata**: Rimozione dei campi non necessari dal DB, dal backend e dal frontend, semplificando il flusso MFA.
**Side effects**: Nessuno previsto, il sistema MFA via Email è già pienamente operativo e indipendente dai campi rimossi.

---

---

## [11:24] [tipo: feature]

**File toccati**:

- `src/components/admin/AdminHeader.tsx` — [Creazione componente Header client-side con titoli dinamici e pulsante "Torna alla Dashboard"]
- `src/app/admin/layout.tsx` — [Integrazione Header dinamico e risoluzione import]

**Problema di partenza**: Necessità di un header reattivo che mostri il titolo della pagina corrente e permetta la navigazione a ritroso nelle sottopagine admin.
**Soluzione applicata**: Implementazione di `AdminHeader` con `usePathname` per gestire i titoli "Dashboard" e "Redazione" e il link di ritorno.
**Side effects**: Nessuno.

---
