---
titolo: "Index — Feature Sphere"
tipo: index
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-sphere
---

# Feature - Sphere

## Scopo e responsabilità
Rappresenta il cuore tecnologico di nozapp: una visualizzazione 3D semantica che permette agli utenti di esplorare articoli e contenuti in uno spazio navigabile. Utilizza Three.js per il rendering e algoritmi di clustering per il posizionamento dei nodi.

## File che compongono questa area
- `src/components/SemanticSphere.tsx` — Entry point React per la visualizzazione 3D
- `src/hooks/useSphereEngine.ts` — Motore di calcolo per posizioni, collisioni e animazioni della sfera
- `src/app/sphere/` — Pagina di visualizzazione a pieno schermo
- `src/components/sphere/` — Componenti di dettaglio (nodi, etichette, tooltip 3D)

## Sezioni di approfondimento
> Questi file verranno generati dall'Agente Relatore

- [[motore-grafico-threejs]] — Configurazione scene, camera e renderer
- [[algoritmo-posizionamento]] — Distribuzione Fibonacci e gusci semantici
- [[interazioni-utente-3d]] — Raycasting, navigazione e HUD 2D

## Dipendenze da altre macroaree
- [[areas/infrastruttura/infrastruttura]] — Recupero dati per il riempimento della sfera tramite Supabase
- [[areas/interfaccia-utente/interfaccia-utente]] — Utilizzo di componenti UI per filtri e controlli sovrapposti

## Cronologia modifiche
(Inizialmente vuoto)
