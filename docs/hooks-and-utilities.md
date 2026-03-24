# Hook e Utility

In NoZapp, la logica complessa viene estratta in hook e utility per mantenere i componenti "lean" (leggeri) e facilitare il test della logica di business.

## Custom Hooks

| Hook | Scopo |
| :--- | :--- |
| `useAuth` | Gestisce lo stato dell'utente e la sessione Supabase sul client. |
| `useTheme` | (Opzionale) Gestisce il passaggio tra dark mode e light mode. |

## Utility Functions

Le utility si trovano principalmente in `src/lib/`.

### `src/lib/graph/traversal.ts`
Documentazione delle funzioni core per la navigazione nel grafo cinematografico:

*   **`connectedTo(id, edges)`**: Ritorna un `Set` di ID di tutti i film collegati direttamente al film `id`.
*   **`buildNavContext(...)`**: La funzione più importante. Genera l'intero contesto di navigazione (parent, siblings, children, visible nodes) necessario per aggiornare la Sfera Semantica e il pannello di dettaglio.
*   **`neighbors(id, shells, ...)`**: Trova i vicini di un nodo, filtrandoli eventualmente per appartenenza a specifici gusci (shells).

### `src/lib/utils.ts`
Contiene utility generali come:
*   `cn(...)`: Helper per la concatenazione condizionale di classi Tailwind (standard in progetti Shadcn/UI).
*   Formattatori di date o stringhe per i metadati dei film.

## Logica Three.js (Script Interni)

All'interno di `SemanticSphere.tsx`, esistono utility specifiche non esportate per la gestione della scena:
*   **`fibPos(idx, total, R)`**: Calcola la posizione di un nodo su una sfera utilizzando l'algoritmo della spirale di Fibonacci (distribuzione uniforme).
*   **`buildEdge(a, b, cfg)`**: Crea la geometria e il materiale per un arco curvo tra due punti 3D.

---
[← Torna all'indice](./index.md)
