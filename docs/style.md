# Style Guide & Coding Conventions

> Leggi questo file prima di scrivere qualsiasi riga di codice.
> Le convenzioni qui definite sono vincolanti per tutti gli agenti.

---

## 1. Naming Conventions

| Entità | Convention | Esempio |
|---|---|---|
| Componenti React | PascalCase | `SemanticSphere.tsx`, `UserProfile.tsx` |
| Funzioni / Variabili | camelCase | `getUserData`, `filmScore` |
| Server Actions | verbo + sostantivo | `updateProfile`, `savePillars`, `getRecommendations` |
| Tabelle DB | snake_case plurale | `films`, `editorial_edges`, `user_pillars` |
| Colonne DB | snake_case | `from_film_id`, `created_at` |
| Costanti | SCREAMING_SNAKE_CASE | `MAX_PILLARS`, `GRAPH_DEPTH` |
| Tipi / Interfacce | PascalCase | `Film`, `EditorialEdge`, `UserPillar` |
| File non-componenti | kebab-case | `graph-traversal.ts`, `scoring-utils.ts` |

---

## 2. Next.js Patterns

### 2.1 Data Fetching
```tsx
// ✅ CORRETTO — fetch in Server Component
// app/(app)/sphere/page.tsx
export default async function SpherePage() {
  const films = await getEditorialGraph(); // Server Action o fetch diretto
  return <SemanticSphere data={films} />;
}

// ❌ SBAGLIATO — fetch in Client Component con useEffect
'use client';
useEffect(() => {
  fetch('/api/films').then(...) // Mai fare così
}, []);
```

### 2.2 Server Actions
```ts
// src/app/actions/graph.ts
'use server';

export async function getRecommendations(userId: string): Promise<Film[]> {
  const supabase = createServerClient();
  // logica...
  revalidatePath('/sphere'); // dopo mutazioni
  return serializzableObject; // sempre serializzabile
}
```

**Regole Server Actions:**
- Vivono in `src/app/actions/` oppure in file `actions.ts` co-locati con la route.
- Sempre `'use server'` in cima al file.
- Sempre ritornano oggetti serializzabili (no classi, no Date raw → usa `.toISOString()`).
- Usa `revalidatePath` o `revalidateTag` dopo ogni mutazione.

### 2.3 Client Components
```tsx
'use client'; // solo se necessario: interattività, browser APIs, hooks

// Ricevi i dati come props dal Server Component padre
interface Props {
  films: Film[];
}
export function SemanticSphere({ films }: Props) { ... }
```

**Regola:** Il confine `'use client'` deve essere il più basso possibile nell'albero dei componenti.

---

## 3. UI & Tailwind

### 3.1 Classi condizionali
```tsx
import { cn } from '@/lib/utils';

// ✅ CORRETTO
<div className={cn('base-class', isActive && 'active-class', variant === 'primary' && 'primary-class')} />

// ❌ SBAGLIATO
<div className={`base-class ${isActive ? 'active-class' : ''}`} />
```

### 3.2 @apply
```css
/* ❌ NON usare @apply nei componenti */
.my-button { @apply bg-red-500 px-4 py-2; }

/* ✅ Solo per stili globali in globals.css */
@layer base {
  body { @apply bg-background text-foreground; }
}
```

### 3.3 Componenti shadcn/ui
- Non modificare i file in `src/components/ui/` direttamente.
- Per customizzare, wrappa il componente shadcn in un nuovo componente in `src/components/shared/`.
- Installa nuovi componenti shadcn con: `npx shadcn-ui@latest add <component>`.

---

## 4. TypeScript

### 4.1 Tipi Supabase
```ts
// Genera sempre i tipi aggiornati dopo modifiche allo schema:
// supabase gen types typescript --project-id <id> > src/types/supabase.ts

// Usa il tipo Database ovunque:
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

function myFn(supabase: SupabaseClient<Database>) { ... }
```

### 4.2 Tipi di Dominio
```ts
// src/types/domain.ts — tipi semantici dell'applicazione
export type EdgeType = 'thematic' | 'stylistic' | 'contrast';

export interface Film {
  id: string;
  title: string;
  year: number;
  director: string;
  posterUrl: string | null;
}

export interface EditorialEdge {
  id: string;
  fromFilmId: string;
  toFilmId: string;
  type: EdgeType;
  label: string;
  weight: number;
}

export interface UserPillar {
  filmId: string;
  rank: number; // 1 = pilastro più forte
}
```

### 4.3 Regole Generali TypeScript
- Strict mode sempre attivo (`"strict": true` in `tsconfig.json`).
- Mai usare `any`. Usa `unknown` se il tipo è davvero ignoto, poi narrowing.
- Preferisci `interface` per oggetti, `type` per union/intersection.
- Usa `satisfies` per validare letterali contro un tipo senza perdere l'inferenza.

---

## 5. Supabase Client — Quale Usare

| Contesto | Import |
|---|---|
| Server Component / Server Action | `import { createServerClient } from '@/lib/supabase/server'` |
| Client Component | `import { createBrowserClient } from '@/lib/supabase/client'` |
| Middleware | `import { createMiddlewareClient } from '@/lib/supabase/middleware'` |

**Non importare mai `@supabase/supabase-js` direttamente** fuori da `src/lib/supabase/`.

---

## 6. Error Handling

```ts
// ✅ Pattern standard per Server Actions
export async function savePillars(pillars: UserPillar[]) {
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from('user_pillars').insert(pillars);
    if (error) throw error;
    revalidatePath('/sphere');
    return { success: true };
  } catch (err) {
    console.error('[savePillars]', err);
    return { success: false, error: 'Impossibile salvare i pilastri.' };
  }
}
```

- Ogni Server Action ritorna `{ success: boolean; error?: string }`.
- Non esporre mai messaggi di errore interni all'utente.
- Loga sempre con un prefisso `[nomeAction]` per facilitare il debug.
