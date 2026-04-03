---
titolo: "Motore Grafico Three.js"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-sphere
---

# Motore Grafico Three.js

## Panoramica
Il cuore visivo di nozapp è la Sfera Semantica, un ambiente 3D interattivo che renderizza centinaia di nodi (film/articoli) collegati tra loro. Il motore è implementato tramite `Three.js` e ottimizzato per performance elevate su WebGL.

## Analisi tecnica

### Engine Hook
**Percorso:** `src/hooks/useSphereEngine.ts`
**Ruolo:** Gestione del ciclo di vita Three.js (Scene, Camera, Renderer).

**Descrizione:**
Il motore viene inizializzato all'interno di un hook React che gestisce:
- **Scena e Luci**: Una scena scura con nebbia esponenziale (`THREE.FogExp2`) per dare profondità.
- **Rendering Proiettato**: Suddivisione dei nodi in 3 gusci ("Shells") concentrici. Ogni shell ha proprietà visive differenti (colore, dimensione del nucleo, intensità del glow).
- **Materiali e Geometrie**: Utilizzo di `MeshBasicMaterial` con blending additivo per i glow, minimizzando il costo computazionale rispetto a shader complessi.

### Sistema di Animazione (Tweening)
**Descrizione:**
Invece di librerie esterne, l'engine implementa un sistema interno di `TWEEN_TASKS`. Questo sistema processa ad ogni frame le transizioni di opacità, posizione e scala, utilizzando curve di easing personalizzate (quadradic in/out).

## Punti di attenzione
- **Performance WebGL**: Il numero di segmenti delle sfere (` SphereGeometry`) è tenuto basso per permettere il rendering di molti nodi senza cali di frame rate.
- **Z-Fighting**: Gestito tramite offset minimi e profondità di rendering controllata.

## Vedi anche
- [[feature-sphere]] — torna alla panoramica dell'area
- [[algoritmo-posizionamento]] — come i nodi sono distribuiti nello spazio
