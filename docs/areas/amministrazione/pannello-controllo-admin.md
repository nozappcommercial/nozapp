---
titolo: "Pannello Controllo Admin"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: amministrazione
---

# Pannello Controllo Admin

## Panoramica
La dashboard amministrativa di nozapp è lo strumento centralizzato per la gestione dei contenuti, degli utenti e delle impostazioni globali del sistema. È protetta da un doppio livello di sicurezza: ruoli DB e MFA (Multi-Factor Authentication).

## Analisi tecnica

### Struttura della Dashboard
**Percorso:** `src/app/admin/`
**Sezioni principali:**
- **Analisi**: Monitoraggio dell'attività utente e delle performance della Sfera.
- **Redazione**: Pannello di scrittura e revisione per gli articoli editoriali.
- **Cinema**: Gestione dei film attualmente in programmazione.
- **Collegamenti**: Strumenti per mappare nuove relazioni nel grafo semantico.
- **Utenti**: Gestione dei ruoli e assistenza tecnica.

### Navigazione e Accessibilità
La dashboard utilizza un layout dedicato (Sidebar) per facilitare lo switch tra contesti amministrativi differenti, mantenendo la coerenza visiva con il brand nozapp ma virando verso uno stile più funzionale e informativo.

## Punti di attenzione
- **Redirect loop**: Un errore nelle politiche MFA nel middleware potrebbe bloccare l'accesso; la pagina di `/admin/verify` deve essere sempre accessibile agli amministratori autenticati in Supabase.

## Vedi anche
- [[amministrazione]] — torna alla panoramica dell'area
- [[gestione-permessi]] — chi può accedere a cosa
