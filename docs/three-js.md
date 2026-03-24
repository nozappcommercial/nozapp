# Componenti e Scena 3D (Three.js)

La visualizzazione 3D è il cuore tecnologico di NoZapp, implementata nel componente `SemanticSphere.tsx`.

## Il Componente `SemanticSphere`

*   **Percorso**: `src/components/SemanticSphere.tsx`
*   **Motore**: Three.js (Vanilla Three.js all'interno di un componente React).
*   **Scopo**: Rendering di un grafo 3D interattivo dove i nodi sono film e gli archi sono relazioni editoriali.

### Dettagli Tecnici

*   **Geometria Node**: `SphereGeometry` per il core (centro solido) e per il glow (alone esterno).
*   **Materiali**: `MeshBasicMaterial` con trasparenza e blending per ottimizzare le performance su dispositivi mobili.
*   **Archi (Edges)**: Curve di Bezier quadratiche (`QuadraticBezierCurve3`) con gradienti di colore basati sul tipo di relazione (Tematica, Stilistica, Contrasto).

### Animazioni e Logica di Scena

*   **Tween Engine**: Implementazione custom di un sistema di tweening (funzione `addTween`) per gestire transizioni fluide tra i "gusci" (shells).
*   **Camera Control**: Gestione dinamica di `camTarget` e `targetCameraZ` per zoomare e ruotare la visuale in base alla navigazione.
*   **Raycasting**: Utilizzato per rilevare il click o l'hover sui nodi cinematografici.
*   **Feedback Visivo**:
    *   Flash dell'overlay durante il cambio di shell.
    *   Highlight dei nodi connessi durante la selezione.
    *   Effetto di rotazione inerziale (momentum) controllato dal mouse/touch.

### Ottimizzazioni

*   **Responsive**: Il renderer WebGL si adatta dinamicamente alle dimensioni della finestra.
*   **Device Pixel Ratio**: Limitato a un massimo di 2 per bilanciare qualità e performance.
*   **Fog**: Utilizzo di `THREE.FogExp2` per dare profondità e misticismo alla scena.

## Variabili di Controllo

*   `activeShell`: Determina quale livello di profondità è attualmente attivo (0, 1 o 2).
*   `navContext`: Mantiene lo stato attuale della navigazione nel grafo (nodo corrente, genitori, fratelli).

---
[← Torna all'indice](./index.md)
