---
titolo: "Configurazione Profilo Iniziale"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: feature-onboarding
---

# Configurazione Profilo Iniziale

## Panoramica
Al termine della wizard di onboarding, i dati raccolti vengono elaborati per creare il profilo semantico dell'utente. Questa fase è cruciale perché determina la qualità dei futuri consigli.

## Analisi tecnica

### Salvataggio delle Preferenze
**Percorso:** `src/components/onboarding/ConfirmPhase.tsx`
**Ruolo:** Sottomissione finale dei dati.

**Descrizione:**
I film selezionati dall'utente vengono inviati a una Server Action (o API) che aggiorna la tabella delle preferenze utente su Supabase. Questo triggera (lato backend) l'algoritmo di generazione del grafo personalizzato.

### Transizione alla Sfera
**Descrizione:**
Una volta confermato il profilo, l'utente viene reindirizzato alla rotta `/sphere`. In questa fase, se il grafo non è ancora pronto, viene visualizzato uno stato di caricamento ("Sfera in preparazione") gestito nella pagina `src/app/sphere/page.tsx`.

## Punti di attenzione
- **Dati Freddi**: Se un utente salta l'onboarding, il sistema non ha dati per costruire la sfera. È fondamentale gestire il caso di "Empty State" come visto nell'area Core.
- **Idempotenza**: La sottomissione deve essere gestita in modo da non creare duplicati se l'utente clicca più volte sul pulsante di conferma.

## Vedi anche
- [[feature-onboarding]] — torna alla panoramica dell'area
- [[flusso-wizard-onboarding]] — origine delle selezioni
