---
titolo: "Grafo Editoriale"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-redazione
---

# Grafo Editoriale

## Panoramica
Il grafo editoriale definisce come gli articoli, i film e i temi sono connessi tra loro. Queste relazioni alimentano i collegamenti visibili nella Sfera e suggeriscono contenuti correlati all'utente.

## Analisi tecnica

### Attraversamento del Grafo
**Percorso:** `src/lib/graph/traversal.ts`
**Ruolo:** Logica di connessione semantica.

**Descrizione:**
Il file definisce le interfacce `FilmNode` e `FilmEdge` e funzioni per navigare le relazioni:
- **`connectedTo`**: Restituisce tutti i vicini di primo grado di un nodo.
- **`neighbors`**: Permette di filtrare i vicini in base alla shell di appartenenza (es. "trovami tutti gli articoli correlati a questo film nella shell Scoperta").

### Tipi di Relazione (Edges)
Le connessioni possono essere di diversi tipi:
- **Tematiche**: Legami basati su argomenti comuni.
- **Stilistiche**: Legami basati sulla forma, la regia o l'estetica.
- **Contrasto**: Collegamenti tra contenuti opposti per stimolare la scoperta.

## Punti di attenzione
- **Integrità dei dati**: Il grafo dipende dalla precisione dei metadati (id dei film e slug degli articoli). Referenze errate possono rompere la navigazione nella sfera.

## Vedi anche
- [[feature-redazione]] — torna alla panoramica dell'area
- [[areas/feature-sphere/algoritmo-posizionamento]] — rappresentazione visuale del grafo
