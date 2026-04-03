---
titolo: "Index — Strumenti di Sviluppo & Dati"
tipo: index
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: sviluppo-strumenti
---

# Strumenti di Sviluppo & Dati

## Scopo e responsabilità
Questa area non fa parte del bundle di produzione ma è essenziale per il workflow di sviluppo. Include i dataset grezzi, script per processare contenuti, benchmark e sandbox per nuove feature.

## File che compongono questa area
- `dataset/` — Dati di input e file JSON per il caricamento dei database
- `scripts/` — Task di manutenzione, migrazione e pre-processing
- `sandbox/` — Componenti sperimentali e pagine di test isolate
- `utility/` — Script cross-repo per la gestione del codebase

## Sezioni di approfondimento
> Questi file verranno generati dall'Agente Relatore

- [[scripts-configurazione]] — Utility CLI per manutenzione e seeding
- [[pipeline-deploy]] — Workflow di pubblicazione su Vercel

## Dipendenze da altre macroaree
- [[areas/infrastruttura/infrastruttura]] — Gli script spesso interagiscono con il database Supabase

## Cronologia modifiche
(Inizialmente vuoto)
