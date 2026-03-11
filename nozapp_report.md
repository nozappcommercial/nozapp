# Nozapp - Report di Analisi del Progetto

## 1. Project Overview
**Nozapp** è un'applicazione web moderna il cui scopo principale è fungere da motore di raccomandazione ed esplorazione editoriale nel mondo del cinema. Attraverso un'interfaccia 3D immersiva (chiamata "Sfera Semantica"), l'utente naviga un grafo di film. Il sistema non filtra i film per metadati classici, ma naviga un grafo editoriale basato su connessioni (tematiche, stilistiche, ecc.) e su un processo di onboarding "psicografico" obbligatorio chiamato "Pilastri del Gusto".

**Tecnologie Principali:**
- Next.js 14 (App Router)
- React 18
- Supabase (Autenticazione SSR e Database PostgreSQL)
- Three.js (Visualizzazione Grafica 3D della Sfera)
- Tailwind CSS e shadcn/ui per lo styling

---

## 2. File & Folder Structure
La struttura delle directory del progetto riflette un'architettura ibrida Full-Stack. Di seguito i principali file e directory (esclusi le directory di sistema/environment):

```
nozapp/
├── dataset/            # Directory contenente i file CSV, e gli script Python (es. merge_dataset.py, seed_supabase.py) per la gestione e l'importazione dei dati dei film
├── docs/               # Documentazione di progetto (architettura tecnica, regole, stili strutturali, TODO)
├── scripts/            # Script Python. Contiene logiche per la pipeline dati extra e i seed (es: seed_onboarding.py, title-it.py)
├── src/                # Root del codice sorgente dell'app Next.js
│   ├── app/            # Next.js App Router (layout, pagine interne, actions e api)
│   │   ├── (auth)/     # Gruppo di rotte dedicato all'autenticazione (login, onboarding)
│   │   ├── actions/    # Server Actions per l'interazione con il database e il grafo
│   │   ├── api/        # Route Handlers API (es. per il completamento dell'onboarding)
│   │   └── sphere/     # Pagina e layout per l'applicazione principale "Sfera Semantica" protetta
│   ├── components/     # Componenti React riutilizzabili e UI
│   │   ├── sphere/     # Componenti dedicati a Three.js e logiche della sfera e overlay
│   │   └── ui/         # Componenti di base UI preingegnerizzati (probabilmente generati con shadcn)
│   ├── lib/            # Moduli utility, algoritmi (es. scoring/traversal) e setup client/server Supabase
│   └── types/          # Tipi TypeScript, inclusi i tipi generati dalla CLI di Supabase
├── supabase/           # Configurazioni locali per Supabase e migration SQL per setup locale DB
├── package.json        # Gestione delle dipendenze node per sviluppo JS/TS
└── tailwind.config.ts  # Configurazione del tema e dello stile UI (Tailwind)
```

---

## 3. Tech Stack & Dependencies
- **Frontend:**
  - **Framework:** Next.js 14.2.35 (sfruttando le app router e Server Components).
  - **Librerie UI:** React 18, Three.js (`^0.183.2`), Tailwind CSS, `tailwind-merge`, `tailwindcss-animate`, Lucide-React per le icone, e primitivi di UI Radical/Radix.
  - **Form e Validazione:** React Hook Form e Zod.
- **Backend:**
  - **Ambiente/Linguaggio:** Node.js (via Next.js), TypeScript.
  - **Logica/Routine:** Server Actions e Next.js API Routes.
- **Database & Auth:**
  - **Database:** Supabase (implementazione PostgreSQL managed) con abilitazione della RLS.
  - **Auth:** `@supabase/ssr` e pacchetti `supabase-js` per l'integrazione con magic-links. Non sono presenti ORM come Prisma; il DB viene interrogato direttamente con l'SDK Supabase.
- **Dev Dependencies & Tooling:**
  - TypeScript, ESLint (config-next), PostCSS. Non emergono strumenti di testing specializzati (Jest/Vitest) dalle dipendenze nel package.json.

---

## 4. Code Analysis
- **Componenti e Moduli Principali:**
  - **SemanticSphere (`src/components/SemanticSphere.tsx`):** Un wrap impressionante attorno al client Three.js. Gestisce telecamere, geometrie, animazioni tween esclusive e la gestione della logica del grafo per le animazioni tra Shell I, II e III.
  - **Motore di Raccomandazione (`src/lib/graph/`):** Algoritmi BFS (traversamento grafo) per generare percorsi tra il film e i pilastri utente e determinare score e layer (come descritto nell'architettura).
- **API & Routing:**
  - `src/app/api/onboarding/complete/route.ts` (POST): Salva i risultati del form utente e marca l'onboarding come completato in DB.
  - `src/app/auth/callback/route.ts`: Probabilmente gestisce l'exchange della sessione via Auth Callback Supabase.
- **Schema Database (Supabase migrations):**
  - **`films`**: Entità film.
  - **`editorial_edges`**: Edge pesati tra i film (tematiche, stili, contrasto).
  - **`users`** e **`user_pillars`**: Salva le preferenze dell'utente (legame tra utente e node/film)
- **Logica di Sicurezza:**
  - L'applicazione implementa **Row Level Security (RLS)** in PostgreSQL garantendo l'accesso limitato. Le policy permettono selezioni pubbliche sui film, ma CRUD ristretto per profile/user_pillars al solo utente autenticato.

---

## 5. Code Quality & Potential Issues

1. **Manipolazione Diretta del DOM in React (Anti-Pattern)**
   All'interno del componente `SemanticSphere.tsx` si riscontra un uso smodato di selettori DOM grezzi (es. `document.getElementById('labels')`, `document.createElement('div')`, assenza di React refs per molta della UI di Three.js). Costruire UI modificando il DOM direttamente scavalca il virtual DOM di React causando possibili loop in Strict Mode o mancate cancellazioni di code (memory leak, clashing). Sarebbe preferibile un approccio come `@canvas/fiber` (R3F) o usare rigorosamente Noderefs.
2. **Deficit nella Gestione degli Errori e "False Safeties"**
   Nel file `src/app/api/onboarding/complete/route.ts`, la funzione asincrona `fetchWithRetry` prova a gestire gli errori di Timeout/Connect. Tuttavia preme per catturare le eccenzioni su `await operation()`, ignorando che l'SDK di Supabase molto spesso **non lancia throw** nativamente ma restituisce oggetti come `{ data: null, error: { message: '...' } }`. Questo blocco finisce per non tentare il retry su effettivi errori ritornati da Supabase, ritornando invece silent errors in prima istanza.
3. **Mancanza di Input Validation (Backend)**
   Sebbene esista Zod (`^4.3.6`), l'endpoint dell'onboarding legge brutalmente il body JSON e testa la presenza di campi con `if (!pillars || !Array.isArray(pillars))`. Per impedire injection e malformazioni, il parsing dovrebbe avvenire rigidamente validando l'input tramite schemi Zod.
4. **Mancanza (o Carenza) di Testing**
   Non è visibile alcun framework di testing unificato per le routine in TypeScript nè E2E. Dato che il cuore focale è un algoritmo editoriale e un grafo ricorsivo, la mancanza di unit test in `src/lib/graph/` è estremamente rischiosa qualora cambiassero le regole di punteggio.
5. **Vulnerabilità delle dipendenze**
   Le versioni delle directory di Next (`14.2.35` rispetto ad uscite patch imminenti) sono corrette, ma l'impiego massiccio di file `.mjs` senza type-checking a livello di top root (`test_db.mjs`, ecc), potrebbe far sfuggire bug asincroni.

---

## 6. Summary & Recommendations
### Overall Assessment
Il progetto rivela un'ambizione encomiabile e una spiccata tendenza verso un'esperienza utente molto elevata (interfaccia 3D fluida, logiche a shell). L'architettura del DB sfrutta bene il cloud nativo via RLS in Supabase e un middleware ben separato. Tuttavia, la parte frontend che gestisce il Canvas (Three.js) è ingombrante, difficile da manutenere, ed è legata da accoppiamento stretto al DOM invece che a React.  Dal punto di vista della robustezza nel backend, l'attuale assenza di validazione stringente API e di Test rende il motore algoritmico prono a sfaldamenti su futuri update.

### Top 5 Actionable Improvements

1. **Implementare Unit Test (Impatto: Alto)**
   Integrare Vitest o Jest prioritizzando al 100% la directory `src/lib/graph`. Lo score e i pathBFS vanno testati sistematicamente per assicurarsi che i film raccomandati rimangano coerenti.
2. **Refactoring di `SemanticSphere.tsx` (Impatto: Alto)**
   Portare tutte le etichette ("labels", "DOM append child") sotto il governo di variabili di stato o Ref in modo conforme allo standard React, svuotando i container `<div>` via React Component unmounting, oppure procedere gradualmente al refactoring via `react-three-fiber` per disaccoppiare logica visiva dal render del componente.
3. **Zod Validation sulle API Backend (Impatto: Medio-Alto)**
   Introdurre un livello di validazione per le richieste a `POST /api/onboarding/complete` definendo esplicitamente lo schema dei `pillars` attesi in ricezione.
4. **Fix della Retry Policy di Supabase (Impatto: Medio)**
   Riparare la funzione `fetchWithRetry` nei route handler, facendo scattare il "throw" ogni volta che `res.error` è truthy e non è nullo, oppure impiantando i retry solo per problemi di socket networking (ConnectTimeout).
5. **Riordino Sandbox e Script di Supporto (Impatto: Basso ma architetturale)**
   Gli script in `.mjs` e in `.py` lasciati in modo sparso nella main directory e in `/dataset` dovrebbero essere tutti consolidati sotto la directory `/scripts`, con un `package.json` dedicato o comandi pnpm appositi nel package principale, al fine di garantire un unico entry point CLI senza inquinare la root dell'app.
