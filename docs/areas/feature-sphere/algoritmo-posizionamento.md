---
titolo: "Algoritmo di Posizionamento"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-sphere
---

# Algoritmo di Posizionamento

## Panoramica
Per evitare sovrapposizioni e garantire una distribuzione equa dei contenuti sulla superficie della sfera, nozapp utilizza un algoritmo di distribuzione basato sulla spirale di Fibonacci (Fibonacci Sphere).

## Analisi tecnica

### Fibonacci Distribution
**Percorso:** `src/hooks/useSphereEngine.ts` (Funzione `fibPos`)
**Ruolo:** Calcolo coordinate 3D dei nodi.

**Descrizione:**
L'algoritmo distribuisce `N` punti su una sfera di raggio `R`. Utilizza il "rapporto aureo" per determinare l'angolo di rotazione tra i punti successivi, garantendo una densità uniforme indipendentemente dal numero di elementi.

### Struttura a Gusci (Shells)
I contenuti sono suddivisi su tre livelli di profondità semantica:
1.  **Pilastri (Shell 0)**: I contenuti core dell'utente, posizionati sul raggio interno.
2.  **Affinità (Shell 1)**: Contenuti correlati ai pilastri, posizionati sul guscio intermedio.
3.  **Scoperta (Shell 2)**: Contenuti nuovi o meno affini, posizionati sul guscio esterno.

### Connessioni (Edges)
Le relazioni tra i nodi sono renderizzate come curve di Bezier quadratiche che viaggiano tra i punti. La "curvatura" viene calcolata in base alla distanza tra i nodi per evitare che le linee attraversino il centro della sfera.

## Punti di attenzione
- **Ordinamento Semantico**: L'ordine dei nodi nell'array determina la loro posizione sulla spirale; contenuti simili dovrebbero essere vicini nell'array per apparire vicini nella sfera.

## Vedi anche
- [[feature-sphere]] — torna alla panoramica dell'area
- [[motore-grafico-threejs]] — rendering fisico delle posizioni
