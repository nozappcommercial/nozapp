---
titolo: "Index — Feature Redazione"
tipo: index
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-redazione
---

# Feature - Redazione

## Scopo e responsabilità
Questa area gestisce l'esperienza di consumo e creazione dei contenuti editoriali. Include la visualizzazione degli articoli, la navigazione per tag e categorie, e la struttura gerarchica del grafo editoriale.

## File che compongono questa area
- `src/app/redazione/` — Router per le pagine editoriali e articoli singoli
- `src/lib/graph/` — Utility per navigare le relazioni tra i contenuti e trovare articoli correlati
- `src/app/redazione/[slug]/` — Gestione dinamica degli articoli

## Sezioni di approfondimento
> Questi file verranno generati dall'Agente Relatore

- [[gestione-contenuti]] — Workflow editoriale e integrazione Supabase
- [[grafo-editoriale]] — Relazioni semantiche e attraversamento
- [[visualizzazione-articoli]] — Rendering markdown e front-end editoriale

## Dipendenze da altre macroaree
- [[areas/feature-sphere/feature-sphere]] — Gli articoli della redazione sono i "nodi" visualizzati nella sfera
- [[areas/interfaccia-utente/interfaccia-utente]] — Utilizzo intensivo di componenti UI per la lettura (Typography)

## Cronologia modifiche
(Inizialmente vuoto)
