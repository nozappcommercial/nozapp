---
date: 2026-03-28
status: active
---

## 08:50 [tipo: feature]

**File toccati**:

- `src/components/admin/AdminHeader.tsx` — Ottimizzato l'header per mobile: aggiunto padding per il notch e trasformati i pulsanti in icone circolari (senza testo) su schermi piccoli.
- `src/components/admin/PlatformStatus.tsx` — Creato nuovo componente Client per lo stato della piattaforma con effetto accordion su mobile.
- `src/app/admin/page.tsx` — Integrato il nuovo componente `PlatformStatus` nella dashboard.
- `src/app/admin/redazione/page.tsx` — Ottimizzata la visualizzazione degli articoli per mobile: introdotta la vista a "card" per piccoli schermi e migliorata la tabella desktop con una gestione più pulita degli stati (badge).

**Problema di partenza**: L'header veniva coperto dal notch su mobile e i pulsanti erano troppo ingombranti. La sezione "Stato Piattaforma" occupava troppo spazio verticale su mobile. La tabella degli articoli era difficile da consultare su smartphone a causa dello scorrimento orizzontale.
**Soluzione applicata**: Utilizzato `env(safe-area-inset-top)` per l'header. Implementato accordion per lo stato piattaforma. Aggiunta vista responsive per gli articoli che passa da tabella (desktop) a card (mobile) in modo fluido.
**Side effects**: Introdotta una funzione helper `getStatusBadge` per centralizzare la logica di visualizzazione dello stato.

---
