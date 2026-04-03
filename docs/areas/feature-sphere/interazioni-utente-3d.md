---
titolo: "Interazioni Utente 3D"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-sphere
---

# Interazioni Utente 3D

## Panoramica
La Sfera Semantica non è solo statica; supporta un'ampia gamma di interazioni per permettere all'utente di navigare i dati. Queste includono rotazione, zoom, selezione di nodi e navigazione assistita.

## Analisi tecnica

### Selezione e Raycasting
**Percorso:** `src/hooks/useSphereEngine.ts` (Funzione `getHit`)
**Ruolo:** Conversione coordinate mouse 2D in oggetti 3D.

**Descrizione:**
Utilizza la classe `THREE.Raycaster` per proiettare un raggio dalla camera attraverso la posizione del mouse. Identifica il primo nodo visibile (con opacità > 0) colpito dal raggio. 

### Navigazione Context-Aware
**Percorso:** `src/lib/graph/traversal.ts` (Funzione `buildNavContext`)
**Ruolo:** Logica di spostamento tra nodi correlati.

**Descrizione:**
Quando un nodo viene selezionato:
1.  Viene generato un `NavContext` che identifica "Genitori", "Fratelli" e "Figli" semantici.
2.  La camera si sposta automaticamente verso il nodo selezionato tramite un'animazione di slerp (rotazione) e lerp (distanza). 
3.  L'interfaccia 2D (Overlay) mostra controlli direzionali per navigare nel grafo senza usare il mouse.

### HUD e Etichette 2D
**Descrizione:**
Per garantire leggibilità, i titoli dei nodi non sono renderizzati in 3D ma sono elementi HTML sovrapposti al canvas. L'engine proietta la posizione 3D nello spazio 2D dello schermo (`project`) e aggiorna le coordinate DOM ad ogni frame.

## Punti di attenzione
- **Pinch Zoom**: Supportato su dispositivi touch per cambiare shell (livello di navigazione).
- **Inerzia**: La rotazione della sfera ha un sistema di inerzia che continua il movimento dopo il rilascio del cursore.

## Vedi anche
- [[feature-sphere]] — torna alla panoramica dell'area
- [[areas/feature-redazione/grafo-editoriale]] — come i legami vengono definiti
