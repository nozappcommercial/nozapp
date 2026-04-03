---
titolo: "Index — Architettura Core"
tipo: index
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: architettura-core
---

# Architettura Core

## Scopo e responsabilità
Questa macroarea definisce la struttura portante dell'applicazione Next.js, includendo il layout radice, le configurazioni di sistema, i tipi globali e le utility di base. È la "colla" che tiene insieme tutti gli altri moduli.

## File che compongono questa area
- `src/app/layout.tsx` — Layout radice: setup di provider, font e metadati
- `src/app/page.tsx` — Homepage principale dell'applicazione
- `src/app/globals.css` — Definizione degli stili globali Tailwind e variabili CSS
- `src/lib/config.ts` — Costanti e configurazioni dell'ambiente
- `src/lib/utils.ts` — Utility helper condivise (tailwind-merge, clsx)
- `src/types/` — Cartella contenente interfacce e tipi TypeScript globali

## Sezioni di approfondimento
> Questi file verranno generati dall'Agente Relatore

- [[struttura-nextjs]] — Dettagli sul routing e l'app router
- [[configurazioni-globali]] — Gestione delle variabili d'ambiente e setup
- [[design-tokens]] — Variabili CSS e token di design principali

## Dipendenze da altre macroaree
- [[areas/interfaccia-utente/interfaccia-utente]] — Utilizza componenti di layout globali (Navbar/Footer)
- [[areas/autenticazione/autenticazione]] — Gestisce la sessione utente a livello di root layout

## Cronologia modifiche
(Inizialmente vuoto)
