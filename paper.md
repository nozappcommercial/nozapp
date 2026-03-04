# doc.md — Documentazione Tecnica

> Questo è il documento "vivente" del progetto.
> Il **Docs Agent** lo aggiorna ad ogni iterazione: nuovi componenti, nuove API, nuove decisioni di implementazione.
> Gli altri agenti lo leggono per capire cosa esiste già prima di costruire qualcosa di nuovo.

---

## Stato Attuale del Progetto

**Fase:** Prototipazione / Setup iniziale
**Data ultimo aggiornamento:** 2026-03-02
**Onboarding completato:** No (in sviluppo)
**Sfera Semantica:** Prototipo HTML/Three.js — da convertire in componente Next.js

---

## Componenti Implementati

### `SemanticSphere` — Prototipo Three.js
**Stato:** Prototipo standalone (HTML)
**Path futuro:** `src/components/sphere/SemanticSphere.tsx`

Il prototipo implementa:
- Struttura a **3 shell concentriche** su sfere fibonacciane:
  - Shell 0 (r=1.3) — Pilastri del Gusto (nodi ember `#e8613a`)
  - Shell 1 (r=2.7) — Affinità dirette (nodi gold `#c9a84c`)
  - Shell 2 (r=4.2) — Scoperta laterale (nodi cold blue `#5ab4d6`)
- **Archi curvi** (QuadraticBezierCurve3) con gradiente colore per tipo:
  - `thematic`: ember → gold
  - `stylistic`: gold → cold
  - `contrast`: cold → blu scuro
- **Label HTML** overlay sincronizzate con la proiezione 3D, visibilità contestuale
- **Hover**: evidenzia sub-grafo locale, nodi non connessi vengono dimmed
- **Click**: seleziona e blocca il nodo, apre pannello info, shimmer sugli archi attivi
- **Rotazione** automatica con inerzia, interrotta solo al click
- **Zoom** via scroll sulla camera

**TODO per integrazione Next.js:**
- [ ] Estrarre la logica Three.js in `SphereScene.ts` (no React)
- [ ] Wrappare in `'use client'` component con `useEffect` per il mount del canvas
- [ ] Ricevere i dati `films` e `edges` come props dal Server Component
- [ ] Aggiungere `ResizeObserver` per responsive
- [ ] Gestire cleanup Three.js al unmount (`renderer.dispose()`)

---

## Server Actions Pianificate

### `getEditorialGraph()`
```ts
// src/app/actions/graph.ts
async function getEditorialGraph(): Promise<{ films: Film[]; edges: EditorialEdge[] }>
```
- Carica tutti i film e gli archi editoriali da Supabase.
- Usata dal Server Component `SpherePage` per idratare la Sfera.
- Può essere cached con `unstable_cache` (i dati editoriali cambiano raramente).

### `getRecommendations(userId: string)`
```ts
async function getRecommendations(userId: string): Promise<RecommendationPath[]>
```
- Carica i pilastri dell'utente, esegue BFS sul grafo, ritorna percorsi ordinati per score.
- `RecommendationPath`: `{ film: Film; path: EditorialEdge[]; score: number }`

### `savePillars(pillars: UserPillar[])`
```ts
async function savePillars(pillars: UserPillar[]): Promise<ActionResult>
```
- Salva i pilastri selezionati nel form di onboarding.
- Imposta `onboarding_complete = true` su `users`.
- Ritorna `{ success: boolean; error?: string }`.

### `updateProfile(data: Partial<UserProfile>)`
```ts
async function updateProfile(data: Partial<UserProfile>): Promise<ActionResult>
```
- Aggiorna `display_name` e altri campi della tabella `users`.

---

## Route Map

| Route | Tipo | Descrizione | Stato |
|---|---|---|---|
| `/login` | Server | Magic link login | 🔲 Da fare |
| `/onboarding` | Client | Form psicografico Pilastri | 🔲 Da fare |
| `/sphere` | Server + Client | Sfera Semantica interattiva | 🔲 In progress |
| `/film/[id]` | Server | Dettaglio film + path editoriale | 🔲 Da fare |
| `/profile` | Client | Gestione pilastri utente | 🔲 Da fare |

---

## Supabase — Schema Attuale

> Per lo schema completo vedere `architecture.md`.

**Tabelle create:** nessuna ancora — schema in fase di definizione.
**RLS policies:** da implementare dopo creazione tabelle.

**Prossimi step DB:**
1. Creare tabella `films` con seed dei film editoriali
2. Creare tabella `editorial_edges` con seed degli archi
3. Creare tabella `users` (estensione di `auth.users`)
4. Creare tabella `user_pillars`
5. Attivare RLS e scrivere policies
6. Generare tipi TypeScript

---

## Variabili d'Ambiente

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # Solo server-side, mai esposta al client
```

---

## Dipendenze Chiave

```json
{
  "next": "14.x",
  "react": "18.x",
  "@supabase/supabase-js": "^2.x",
  "@supabase/ssr": "^0.x",
  "three": "^0.162.x",
  "@types/three": "^0.162.x",
  "tailwindcss": "^3.x",
  "shadcn-ui": "latest"
}
```

---

## Note & Decisioni di Implementazione

### 2026-03-02 — Scelta Three.js vs librerie React-3D
Valutato `react-three-fiber` (R3F) come alternativa a Three.js puro.
**Decisione:** usare Three.js imperativo isolato in `SphereScene.ts`, fuori da React.
**Motivazione:** la Sfera richiede controllo fine sul render loop (inerzia, raycast, shader personalizzati).
R3F introduce overhead di riconciliazione non necessario per un canvas 3D con logica custom.

### 2026-03-02 — Label HTML vs Three.js Sprites
Le etichette dei nodi sono implementate come elementi HTML assoluti proiettati via `Vector3.project(camera)`.
**Motivazione:** leggibilità tipografica superiore, accessibilità, facilità di stile con CSS/Tailwind.
Il trade-off è la sincronizzazione manuale con il render loop (gestita in `updateLabels()`).
