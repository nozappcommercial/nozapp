---
titolo: "Flusso Wizard Onboarding"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-onboarding
---

# Flusso Wizard Onboarding

## Panoramica
L'onboarding è la prima interazione significativa dell'utente con nozapp. È una procedura guidata in più fasi che aiuta il sistema a comprendere i gusti dell'utente per generare la sua prima Sfera Semantica personalizzata.

## Analisi tecnica

### Orchestrazione del Flusso
**Percorso:** `src/components/onboarding/OnboardingFlow.tsx`
**Ruolo:** Gestore dello stato della wizard.

**Descrizione:**
Una single-page application interna che gestisce la transizione tra diversi step:
1.  **Welcome**: Introduzione alla filosofia del progetto.
2.  **Selection**: L'utente seleziona i propri "Pilastri" (film fondamentali) tra una lista curata di sonde.
3.  **Tuning**: Perfezionamento della sensibilità tematica.
4.  **Confirm**: Riassunto e invio dei dati.

### Recupero Sonde (Probe Films)
**Percorso:** `src/app/onboarding/page.tsx`
**Ruolo:** Fornitura dei contenuti per la selezione iniziale.

**Descrizione:**
Recupera dal database i film marcati come `is_onboarding_probe`. Questi film sono raggruppati (`onboarding_group`) per garantire che l'utente veda una selezione variegata di generi e stili durante il processo.

## Punti di attenzione
- **Resilienza di rete**: Include una logica di `fetchWithRetry` per assicurarsi che i dati dei film vengano caricati anche in caso di timeout momentanei della rete.

## Vedi anche
- [[feature-onboarding]] — torna alla panoramica dell'area
- [[configurazione-profilo-iniziale]] — salvataggio dei risultati
