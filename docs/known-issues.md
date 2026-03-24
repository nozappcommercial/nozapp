# Problemi Noti e TODO

Nonostante la robustezza del sistema, sono identificate alcune aree di miglioramento e limitazioni note.

## Problematiche Three.js

*   **Performance Mobile**: Su dispositivi datati, il rendering di migliaia di nodi può causare cali di frame rate. È attiva una protezione `devicePixelRatio` limitata a 2.
*   **Variabili Duplicate**: In passato sono stati riscontrati problemi con variabili `const` ridichiarate in componenti 3D (Ref. Conversazione cd64df45). Prestare attenzione durante il refactoring di `SemanticSphere.tsx`.
*   **Raycasting su Mobile**: La sensibilità del tocco per la selezione dei nodi potrebbe richiedere regolazioni in base alla densità di pixel dello schermo.

## Dataset e Pipeline

*   **Ambiguità Wikidata**: Alcuni titoli comuni potrebbero essere mappati a film errati se il label inglese non è univoco. Necessario controllo umano sui file `_partial.csv`.
*   **Rate Limiting**: Le API di Wikidata SPARQL e TMDB hanno limiti di velocità. Gli script gestiscono ritardi e backoff, ma elaborazioni massive possono richiedere ore.
*   **Poster Mancanti**: Non tutti i film nel dataset da 900K hanno un `poster_url` valido.

## TODO Generali

*   [ ] Migrazione di `SemanticSphere.tsx` verso **React Three Fiber (R3F)** per allinearsi meglio al pattern dichiarativo di React.
*   [ ] Implementazione di un sistema di caching distribuito per i metadati TMDB per ridurre le chiamate API dirette dal client.
*   [ ] Aggiunta di test di integrazione end-to-end per il flusso di onboarding.
*   [ ] Ottimizzazione del caricamento dei font per migliorare il First Contentful Paint.

---
[← Torna all'indice](./index.md)
