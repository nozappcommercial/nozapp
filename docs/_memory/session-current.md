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
## [20:25] [tipo: bug-fix]
**File toccati**:
- `src/components/profile/profile.css` — Rifatto il sistema di centratura (flex-container), aumentato z-index (2600) per coprire l'header e allineato breakpoint a 768px.
- `src/components/profile/ProfileModal.tsx` — Inserito wrapper di centratura e implementata animazione d'ingresso/uscita fluida con Framer Motion (rimuovendo conflitti con i transform CSS).

**Problema di partenza**: Il riquadro profilo si apriva in posizione errata (non centrato) e non copriva correttamente l'header su desktop.
**Soluzione applicata**: Separato il posizionamento (CSS Flex) dall'animazione (Framer Motion). Aumentata la gerarchia visiva tramite z-index e reso il movimento più premium.
**Side effects**: Nessuno.
## [20:31] [tipo: refactor]
**File toccati**:
- `src/app/actions/editorial.ts` — Aggiornato `getArticleBySlug` per permettere agli admin di visualizzare articoli in bozza o programmati (bypass filtri pubblicazione).
- `src/components/layout/Header.tsx` — Nascosto l'header principale nelle rotte che iniziano con `/admin` per pulizia estetica del pannello di controllo.
- `supabase/migrations/20260326000000_editorial_schema.sql` — Sostituito `role` con `is_admin` nelle policy RLS e aggiunte istruzioni `DROP POLICY IF EXISTS` e `DROP TRIGGER IF EXISTS` per rendere la migrazione idempotente.
- `src/lib/supabase/middleware.ts` — Aggiornato il controllo d'accesso per le rotte `/admin` utilizzando il booleano `is_admin`.
- `src/app/actions/editorial.ts` — Aggiornato l'helper `checkAdmin` per verificare `is_admin === true`.
- `src/types/supabase.ts` — Aggiornati i tipi TypeScript della tabella `users`.
- `docs/walkthrough.md` — Aggiornate le istruzioni SQL per l'abilitazione admin.

**Problema di partenza**: Utilizzo di un campo `role` (stringa) non esistente, preferendo l'esistente variabile booleana `is_admin`.
**Soluzione applicata**: Refactoring completo della logica di autorizzazione admin per allinearsi alla struttura dati esistente del progetto.
**Side effects**: Nessuno, ora il sistema è coerente con il database esistente.

---

## [18:45] [tipo: feature]
**File toccati**:
- `docs/*.md` — Ristrutturazione completa della documentazione in 16 file granulari.
- `docs/progetto.md` — Aggiornato come master index generale.

**Problema di partenza**: La documentazione precedente era troppo accorpata in poche macroaree. L'utente ha richiesto una struttura più dettagliata e tecnica per facilitare l'onboarding e la manutenzione.
**Soluzione applicata**: Rimossi i vecchi file e creato un nuovo set di documenti che copre separatamente: architettura, componenti, 3D, API, dataset, tipi, configurazione e guide operative.
**Side effects**: Tutti i link Obsidian interni sono stati aggiornati per puntare ai nuovi file.
