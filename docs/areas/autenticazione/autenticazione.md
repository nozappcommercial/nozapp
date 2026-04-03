---
titolo: "Index — Autenticazione"
tipo: index
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: autenticazione
---

# Autenticazione

## Scopo e responsabilità
Gestisce tutto il ciclo di vita dell'utente: registrazione, login, recupero password e gestione dei profili. Si appoggia a Supabase Auth per la sicurezza e alla tabella `profiles` per i dati estesi.

## File che compongono questa area
- `src/app/(auth)/` — Gruppo di route per l'interfaccia di login e registrazione
- `src/app/auth/` — Logica di callback OAuth e recupero sessioni
- `src/components/auth/` — Form di login, signup e componenti correlati
- `src/lib/auth-utils.ts` — Funzioni helper per la gestione lato server della sessione

## Sezioni di approfondimento
> Questi file verranno generati dall'Agente Relatore

- [[flusso-registrazione]] — Dettagli tecnici sullo step-by-step di signup
- [[integrazione-supabase-auth]] — Configurazione dei provider e sicurezza
- [[gestione-profili]] — Sincronizzazione dati utente e permessi

## Dipendenze da altre macroaree
- [[areas/infrastruttura/infrastruttura]] — Dipende dal client Supabase SSR
- [[areas/onboarding/onboarding]] — Avvia il flusso di onboarding dopo il primo accesso

## Cronologia modifiche
(Inizialmente vuoto)
