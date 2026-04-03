---
titolo: "Project Index — nozapp"
tipo: index
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: scanner
versione: 1
---

# Project Index — nozapp

## Mappa macroaree

### Architettura Core
> Struttura principale dell'applicazione Next.js, layout globali e configurazioni base.

**File:**
- `src/app/layout.tsx` — Layout radice dell'applicazione
- `src/app/page.tsx` — Pagina di atterraggio principale
- `src/app/globals.css` — Stili globali Tailwind
- `src/lib/config.ts` — Configurazioni centralizzate
- `src/types/` — Definizioni TypeScript globali

**Documentazione:** [[areas/architettura-core/architettura-core]]

### Autenticazione
> Gestione degli accessi, flussi di registrazione e sessioni utente tramite Supabase Auth.

**File:**
- `src/app/(auth)/` — Route di autenticazione (login, register)
- `src/app/auth/` — Endpoint per callback e gestione sessioni
- `src/components/auth/` — Componenti UI per l'autenticazione
- `src/lib/auth-utils.ts` — Utility per la gestione dei profili

**Documentazione:** [[areas/autenticazione/autenticazione]]

### Feature - Sphere
> Motore interattivo "Semantic Sphere" basato su Three.js per l'esplorazione dei contenuti.

**File:**
- `src/components/SemanticSphere.tsx` — Componente principale della sfera
- `src/hooks/useSphereEngine.ts` — Logica di rendering e interazione 3D
- `src/app/sphere/` — Pagina dedicata alla visualizzazione sferica

**Documentazione:** [[areas/feature-sphere/feature-sphere]]

### Feature - Redazione
> Dashboard per la gestione editoriale dei contenuti e visualizzazione articoli.

**File:**
- `src/app/redazione/` — Pagina principale e gestione slug articoli
- `src/lib/graph/` — Utility per la gestione del grafo dei contenuti

**Documentazione:** [[areas/feature-redazione/feature-redazione]]

### Feature - Amministrazione
> Strumenti di gestione di sistema e monitoring dell'applicazione.

**File:**
- `src/app/admin/` — Pannello di controllo amministrazione
- `src/components/admin/` — Componenti specifici per l'interfaccia admin

**Documentazione:** [[areas/amministrazione/amministrazione]]

### Feature - Onboarding
> Percorso guidato per i nuovi utenti alla prima configurazione dell'account.

**File:**
- `src/app/onboarding/` — Layout e step del flusso di onboarding
- `src/components/onboarding/` — Componenti UI degli step di benvenuto

**Documentazione:** [[areas/feature-onboarding/feature-onboarding]]

### Interfaccia Utente
> Libreria di componenti comuni, sistema di design e animazioni.

**File:**
- `src/components/ui/` — Componenti atomici (Shadcn UI)
- `src/components/animations/` — Wrapper per animazioni Framer Motion / Animejs
- `src/components/layout/` — Componenti strutturali (Navbar, Footer)

**Documentazione:** [[areas/interfaccia-utente/interfaccia-utente]]

### Infrastruttura & Backend
> Integrazione con Supabase, API server-side e sistemi di caching (Upstash).

**File:**
- `supabase/` — Migrazioni e configurazione database local
- `src/app/api/` — Route API dell'applicazione
- `src/lib/supabase/` — Client e helper per l'integrazione backend
- `src/lib/rate-limit.ts` — Gestione rate limiting (Upstash)

**Documentazione:** [[areas/infrastruttura/infrastruttura]]

### Strumenti di Sviluppo
> Dataset, script di manutenzione e ambiente sandbox per test.

**File:**
- `dataset/` — Dati grezzi o estratti per il sistema
- `scripts/` — Utility locali per task di gestione dati
- `sandbox/` — Area per esperimenti e test isolati
- `utility/` — Script di basso livello cross-project

**Documentazione:** [[areas/sviluppo-strumenti/sviluppo-strumenti]]

---

## Indice file totali
Scan iniziale completato con 9 macroaree identificate.
Ultimo scan: 03-04-2026
