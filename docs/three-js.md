---
tags: [#threejs, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Motore 3D (Three.js)

[← Torna all'indice](./progetto.md)

## Panoramica
Il cuore di NoZapp è un motore di rendering **Three.js** custom che visualizza il grafo dei film in uno spazio tridimensionale. A differenza di molti progetti Next.js, NoZapp utilizza Three.js **Vanilla** (non React Three Fiber) per avere il massimo controllo sulle performance e sul ciclo di vita degli oggetti.

## Il Componente `SemanticSphere.tsx`
Percorso: `src/components/SemanticSphere.tsx`

Questo componente gestisce l'intera scena 3D, le luci, la telecamera e le interazioni raycasting. 

### Geometrie e Materiali
1. **Nodi (Film)**: 
   - **Core**: `SphereGeometry` con materiale solido (`MeshBasicMaterial` o `MeshStandardMaterial`).
   - **Glow**: Uno sprite o una geometria sovrapposta con `AdditiveBlending` per l'effetto aura.
2. **Archi (Relazioni)**: 
   - Geometria basata su **Quadratic Bezier Curves**.
   - Colore dinamicamente calcolato in base al tipo di connessione emessa dal grafo.
3. **Labels**: Etichette 2D proiettate nello spazio 3D tramite calcolo della posizione video-space (`project()`).

### Animazioni e Loop
Il loop di rendering viene gestito tramite `requestAnimationFrame`.
- **Rotazione Sfera**: Una rotazione base calcolata sulla velocità del mouse o del tocco.
- **Transizioni Camera**: Gestite via un motore di tweening custom (`TWEEN_TASKS`).
- **LookTarget**: La telecamera segue un obiettivo fluido (`camTarget`) per evitare movimenti bruschi.

## Logica della Scena

### Organizzazione a Shell
I nodi sono distribuiti su tre sfere concentriche (shells):
- **Shell 0**: Posizione fissa o distribuzione Fibonacci ad alta densità.
- **Shell 1 & 2**: Raggi crescenti per dare il senso di profondità ed esplorazione.

### Interazioni e Raycasting
Il sistema utilizza un `Raycaster` per rilevare l'interazione del mouse con i nodi.
- **Hover**: Attiva l'evidenziazione del nodo e dei suoi archi connessi.
- **Click**: Avvia la transizione della telecamera e apre il pannello dei dettagli (Movie Ticket).

## Performance e Ottimizzazioni
- **Frustum Culling**: Three.js gestisce nativamente la rimozione degli oggetti fuori campo.
- **Instanced Mesh (da implementare)**: Attualmente i nodi sono oggetti singoli; per dataset > 1000 nodi è previsto il passaggio alle instanced meshes.
- **Raycast Throttling**: Il calcolo delle interazioni è ottimizzato per non saturare la CPU ad ogni frame.

---

### Variabili Critiche di Controllo
Nel codice sono presenti variabili chiave per il fine-tuning della scena:
- `camRadius`: Distanza della camera dal centro.
- `focalLength`: FOV dinamico per l'effetto zoom nelle transizioni.
- `nodeScale`: Fattore di scala dei nodi in base alla popolarità/rating.

---
> [!WARNING]
> Il componente `SemanticSphere.tsx` utilizza `@ts-nocheck` a causa della complessità della tipizzazione degli oggetti Three.js vaniglia all'interno di React. Maneggiare con cautela.
