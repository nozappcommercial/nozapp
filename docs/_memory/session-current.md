---
date: 2026-03-28
status: active
---

## 08:50 [tipo: feature]

**File toccati**:

- `src/components/admin/AdminHeader.tsx` — Ottimizzato l'header per mobile: aggiunto padding per il notch e trasformati i pulsanti in icone circolari (senza testo) su schermi piccoli.
- `src/components/admin/PlatformStatus.tsx` — Creato nuovo componente Client per lo stato della piattaforma con effetto accordion su mobile.
- `src/app/admin/page.tsx` — Integrato il nuovo componente `PlatformStatus` nella dashboard.
- `src/app/admin/redazione/page.tsx` — Ottimizzata la visualizzazione degli articoli per mobile: introdotta la vista a "card" per piccoli schermi e migliorata la tabella desktop con una gestione più pulita degli stati (badge). Raffinati i pulsanti di azione (più piccoli) e migliorata la spaziatura nelle card.
- `src/components/admin/ArticleForm.tsx` & `src/components/admin/CinemaForm.tsx` — Applicato un blocco `<style>` locale per forzare la larghezza dei campi `datetime-local` su iOS, risolvendo definitivamente l'overflow del browser. Inoltre, sono stati aggiunti `min-w-0` e migliorata la gestione degli overflow nei container dello slug e dei testi.

**Problema di partenza**: L'header veniva coperto dal notch su mobile e i pulsanti erano troppo ingombranti. La sezione "Stato Piattaforma" occupava troppo spazio verticale su mobile. La tabella degli articoli era difficile da consultare su smartphone a causa dello scorrimento orizzontale. I campi data nei form strabordavano dai box su iOS a causa di una larghezza minima imposta dal browser.
**Soluzione applicata**: Utilizzato `env(safe-area-inset-top)` per l'header. Implementato accordion per lo stato piattaforma. Aggiunta vista responsive per gli articoli. Applicato CSS specifico (`-webkit-appearance: none`, `min-width: 0`) per i campi data su iOS.
**Side effects**: Introdotta una funzione helper `getStatusBadge` per centralizzare la logica di visualizzazione dello stato.

---

## 09:52 [tipo: bug-fix | config | refactor]

**File toccati**:

- `package.json` — Aumento heap memory di Node a 8GB (`--max-old-space-size=8192`) nello script dev.
- `next.config.mjs` — Rimozione chiavi sperimentali non valide e pulizia config per Next.js 16.
- `src/hooks/useSphereEngine.ts` — Implementazione `dispose()` per geometrie, materiali e renderer di Three.js per prevenire leak durante l'HMR.
- `src/proxy.ts` — (Ex `src/middleware.ts`) Migrazione alla nuova convenzione "Proxy" di Next.js 16 e aggiornamento bot blocked.
- `utility/` — Spostati gli script Python fuori da `src/components` per alleggerire il watcher di Next.js.

**Problema di partenza**: RAM saturata (fino a 6GB+) durante l'esecuzione di `npm run dev` e numerosi avvisi di deprecazione legati a Next.js 16.2.1.
**Soluzione applicata**: Aumentata la memoria disponibile a Node, ottimizzato il cleanup delle risorse GPU nel codice 3D e allineate le convenzioni dei file alle nuove specifiche di Next.js 16 (Middleware -> Proxy).
**Side effects**: La RAM si è stabilizzata a circa 1.03 GB. Rimossi avvisi di invalidità in console.

---
