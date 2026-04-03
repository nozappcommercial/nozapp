---
titolo: "Index — Amministrazione"
tipo: index
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: amministrazione
---

# Amministrazione

## Scopo e responsabilità
Pannello di controllo riservato agli utenti con ruolo `admin` per la gestione di utenti, contenuti e configuratori di sistema. Include log di monitoraggio e tool per operazioni massive.

## File che compongono questa area
- `src/app/admin/` — Route principali protette del pannello admin
- `src/components/admin/` — Componenti specifici per statistiche, liste utenti e manager contenuti

## Sezioni di approfondimento
> Questi file verranno generati dall'Agente Relatore

- [[pannello-controllo-admin]] — Dashboard di gestione contenuti e utenti
- [[gestione-permessi]] — Ruoli DB e Multi-Factor Authentication (OTP)

## Dipendenze da altre macroaree
- [[areas/autenticazione/autenticazione]] — Utilizza i ruoli definiti nei metadati utente
- [[areas/infrastruttura/infrastruttura]] — Accesso diretto ai dati grezzi e API di gestione Supabase

## Cronologia modifiche
(Inizialmente vuoto)
