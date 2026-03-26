---
tags: [#macroarea/sphere-engine, #status/complete]
created: 2026-03-26
agent: scrittore
source-files: [src/components/SemanticSphere.tsx, src/components/sphere.css, src/app/sphere/page.tsx, src/lib/graph/traversal.ts]
---

# Sphere Engine

[← Torna all'indice](./progetto.md)

## Scopo
La macroarea **Sphere Engine** rappresenta il core tecnologico di NoZapp. È responsabile della visualizzazione tridimensionale del grafo semantico dei film, permettendo all'utente di esplorare le connessioni tra titoli attraverso una metafora a "gusci" (shells) concentrici. Gestisce il rendering 3D, le animazioni di transizione, la logica di navigazione spaziale e l'interfaccia di dettaglio dei nodi.

## File coinvolti
| File | Ruolo |
|------|-------|
| `src/components/SemanticSphere.tsx` | Componente monumentale che ospita il motore Three.js e la logica UI 3D. |
| `src/components/sphere.css` | Stili per l'interfaccia overlay, il panel "cinema ticket" e le animazioni CSS. |
| `src/app/sphere/page.tsx` | Pagina Next.js che inizializza la scena caricando i dati personalizzati. |
| `src/lib/graph/traversal.ts` | Logica pura di attraversamento del grafo e calcolo del contesto di navigazione. |

## Struttura e funzionamento

### Il Sistema a Shell (Gusci)
I nodi sono organizzati in tre livelli di astrazione:
1. **Shell 0 (Pilastri)**: I film fondamentali dell'utente.
2. **Shell 1 (Affinità)**: Film strettamente correlati ai pilastri.
3. **Shell 2 (Scoperta)**: Film più distanti, suggeriti per l'esplorazione.

### Spazializzazione e Rendering
I nodi sono posizionati sulla superficie delle sfere utilizzando un algoritmo di distribuzione di **Fibonacci**. Ogni nodo è composto da un core solido e un "glow" semi-trasparente. Le connessioni (edges) sono renderizzate come curve di **Bezier quadratiche** con gradienti di colore basati sul tipo di relazione (tematica, stilistica, contrasto).

### `buildNavContext` — `src/lib/graph/traversal.ts`
**Scopo**: Calcola dinamicamente quali nodi devono essere visibili e quali sono le relazioni (genitori, fratelli, figli) rispetto a un nodo selezionato.
**Esempio dal codice**:
```ts
// path: src/lib/graph/traversal.ts
export function buildNavContext(
    filmIndex: number,
    parent: number | null = null,
    // ...
    films: FilmNode[],
    edges: FilmEdge[]
): NavContext {
    // Calcola figli basandosi su nodi connessi in shell esterne
    const children = neighbors(filmIndex, null, films, edges)
        .filter(id => films[id] && films[id].shell > shell);
    
    // Determina il set di nodi visibili per il rendering selettivo
    const visible = new Set([filmIndex]);
    if (parent !== null) visible.add(parent);
    // ...
    return { current: filmIndex, parent, siblings: sibs, children, visible, ... };
}
```

### `SemanticSphere` — `src/components/SemanticSphere.tsx`
**Scopo**: Integra il loop di animazione di Three.js con il ciclo di vita di React.
**Dipendenze**: `three`, [[data-infrastructure]] (per le interazioni persistenti), `ShellNavigator`.
**Note**: Include un motore di tweening custom (`TWEEN_TASKS`) per gestire le transizioni fluide della telecamera e delle proprietà dei materiali senza l'ausilio di librerie esterne pesanti.

### Visualizzazione dei Dettagli (Movie Panel)
Quando un nodo viene selezionato, compare un pannello laterale con effetto **Glassmorphism** e una maschera che emula un **biglietto del cinema**. Questo pannello è altamente responsivo e supporta interazioni di swipe per la chiusura su dispositivi mobile.

## Relazioni con altre macroaree
- [[data-infrastructure]]: Fornisce i dati del grafo personalizzato tramite Server Actions (`getPersonalizedGraph`) e gestisce i feedback dell'utente (`upsertMovieInteraction`).
- [[auth]]: Assicura che l'utente sia autenticato prima di caricare la sua sfera personale.
- [[ui-system]]: Fornisce gli stili di base e i componenti di navigazione shell.

## Problemi noti
- `SemanticSphere.tsx`: Il file è estremamente grande (1200+ righe) e utilizza `@ts-nocheck`, indicando debito tecnico nella tipizzazione Three.js.
- **Performance**: Il raycasting e la proiezione delle label 2D vengono eseguiti ad ogni frame del loop; potrebbe beneficiare di ottimizzazioni (es. throttling).
- **TODO**: Migrare il motore di tweening custom a `framer-motion` o `gsap` per una manutenzione più semplice.

---
> ⚠️ Da verificare: La logica dei "sibs" (fratelli) in `traversal.ts` sembra favorire i nodi nella stessa shell. Verificare se questo limita la scoperta di connessioni trasversali.
