---
tags: [#maintenance, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Problemi Noti e TODO

[← Torna all'indice](./progetto.md)

## Sviluppo e Codice (TODO)

### 1. Refactoring `SemanticSphere.tsx`
- **Problema**: Il componente è un "super-componente" di oltre 1200 righe.
- **TODO**: Suddividere la logica in hook separati (es. `useSphereEngine.ts`, `useRaycasting.ts`).
- **TODO**: Rimuovere `@ts-nocheck` implementando interfacce corrette per gli oggetti Three.js.

### 2. Validazione API
- **Problema**: Alcuni Route Handlers non utilizzano ancora Zod per la validazione del body.
- **TODO**: Implementare `OnboardingSchema.safeParse(body)` in tutti gli endpoint `app/api/`.

### 3. Gestione Errori UI
- **Problema**: In caso di crash di WebGL, l'applicazione non fornisce un fallback 2D grazioso.
- **TODO**: Implementare un Error Boundary specifico per il canvas Three.js.

## Performance e Ottimizzazioni

### 1. Rendering dei Nodi
- **Problema**: Con più di 1000 film visibili simultaneamente, il numero di draw call di Three.js può causare cali di frame su dispositivi mobile datati.
- **TODO**: Implementare **InstancedMesh** per i core e i glow dei nodi.

### 2. Raycasting Throttling
- **Problema**: Il raycaster viene eseguito ad ogni frame.
- **TODO**: Eseguire il raycast solo ogni 100-200ms o solo al movimento del mouse con throttling.

## Dataset e Pipeline

### 1. Titoli Italiani Mancanti
- **Problema**: Alcuni titoli su Wikidata non sono mappati oppure sono ambigui (omonimi).
- **TODO**: Implementare un controllo manuale o un fallback più avanzato basato su `IMDb ID` per l'arricchimento titoli.

### 2. Immagini dei Poster
- **Problema**: Alcuni poster estratti da Letterboxd visualizzano placeholder 404.
- **TODO**: Script di validazione poster che sostituisce i link rotti con immagini default "no-poster.png".

## Sicurezza e Infrastruttura
- **Rate Limit**: Il bypass di Upstash in ambiente locale potrebbe nascondere bug nelle chiamate API ricorsive.
- **Edge Runtime**: La velocità delle Server Actions potrebbe essere migliorata configurando l'Edge Runtime dove possibile, prestando attenzione alle librerie compatibili (es. `crypto`).

---
> [!WARNING]
> La variabile `CRON_SECRET` è critica per la sincronizzazione dei dati. Non utilizzarla per scopi diversi dalla protezione degli endpoint di amministrazione.
