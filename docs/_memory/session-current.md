---
date: 2026-03-26
status: active## [19:30] [tipo: feature]
**File toccati**:
- `supabase/migrations/20260326000000_editorial_schema.sql` — Tabella articoli e ruoli.
- `src/lib/supabase/middleware.ts` — Protezione `/admin`.
- `src/app/actions/editorial.ts` — Server Actions CRUD.
- `src/app/admin/*` — Pagine gestione redazione.
- `src/app/redazione/[slug]/page.tsx` — Template pubblico articoli.
- `src/components/home/EditorialSection.tsx` — Integrazione dati dinamici.

**Problema di partenza**: Mancanza di un sistema di caricamento e gestione degli articoli della redazione.
**Soluzione applicata**: Implementato un sistema CMS custom integrato con Supabase, con ruoli admin, scheduling delle pubblicazioni, date di scadenza e template visuale coerente con il brand NoZapp.
**Side effects**: Necessaria l'assegnazione manuale del ruolo 'admin' nel DB per il primo accesso al pannello.
## [19:50] [tipo: bug-fix]
**File toccati**:
- `src/components/sphere/ShellNavigator.tsx` — Rimosso `position: fixed` quando in modalità verticale per permettere il posizionamento relativo al genitore.
- `src/components/SemanticSphere.tsx` — Aumentato padding sinistro (da 28px a 48px) e corretta la centratura verticale delle pillole di navigazione desktop.

**Problema di partenza**: Le pillole "Pilastri, Affinità, Scoperta" su desktop erano troppo vicine al bordo sinistro e non risultavano correttamente centrate in altezza.
**Soluzione applicata**: Individuato un conflitto di posizionamento (`fixed` interno che ignorava il contenitore `absolute` centrato). Aumentato il margine e pulito il codice CSS inline.
**Side effects**: Nessuno.

---

## [18:45] [tipo: feature]
**File toccati**:
- `docs/*.md` — Ristrutturazione completa della documentazione in 16 file granulari.
- `docs/progetto.md` — Aggiornato come master index generale.

**Problema di partenza**: La documentazione precedente era troppo accorpata in poche macroaree. L'utente ha richiesto una struttura più dettagliata e tecnica per facilitare l'onboarding e la manutenzione.
**Soluzione applicata**: Rimossi i vecchi file e creato un nuovo set di documenti che copre separatamente: architettura, componenti, 3D, API, dataset, tipi, configurazione e guide operative.
**Side effects**: Tutti i link Obsidian interni sono stati aggiornati per puntare ai nuovi file.
