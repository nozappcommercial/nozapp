# Tipi e Interfacce TypeScript

Il progetto è fortemente tipizzato per garantire la robustezza delle interazioni tra il database, le API e la visualizzazione 3D.

## Definizioni Principali

Le interfacce core si trovano in `src/types/` e `src/lib/graph/traversal.ts`.

### `FilmNode`
Rappresenta un singolo film nel sistema.
```typescript
interface FilmNode {
    id: number;
    title: string;
    year: number;
    dir: string;
    shell: number;        // Livello di profondità (0, 1, 2)
    tags: string[];
    poster_url?: string;  // Link all'immagine di copertina
    interaction?: 'seen' | 'liked' | 'ignored';
}
```

### `FilmEdge`
Rappresenta una connessione editoriale tra due film.
```typescript
interface FilmEdge {
    from: number;
    to: number;
    type: 'thematic' | 'stylistic' | 'contrast';
    label: string;
}
```

### `NavContext`
Mantiene lo stato della navigazione attiva.
```typescript
interface NavContext {
    current: number;       // ID del film selezionato
    parent: number | null; // ID del genitore (se presente)
    siblings: number[];    // ID dei fratelli dello stesso livello
    children: number[];    // ID dei figli (livello successivo)
    visible: Set<number>;  // Insieme di ID da renderizzare
}
```

## Database Schema (Supabase)
I tipi auto-generati o definiti in `src/types/supabase.ts` mappano esattamente le tabelle PostgreSQL:
*   `Table["public"]["Tables"]["films"]`
*   `Table["public"]["Tables"]["editorial_edges"]`
*   `Table["public"]["Tables"]["user_film_interactions"]`

---
[← Torna all'indice](./index.md)
