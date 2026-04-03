---
titolo: "Struttura Next.js"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: architettura-core
---

# Struttura Next.js

## Panoramica
Questa sezione descrive l'organizzazione dell'App Router di Next.js nel progetto nozapp, focalizzandosi sul layout radice, la gestione delle rotte e i provider globali che garantiscono il funzionamento dell'applicazione.

## Analisi tecnica

### Root Layout
**Percorso:** `src/app/layout.tsx`
**Ruolo:** Entry point strutturale dell'applicazione.

**Descrizione:**
Il layout definisce la struttura HTML di base e carica i font Geist Sans e Mono. Integra diversi componenti critici:
- **Provider di sistema**: `Analytics` e `SpeedInsights` di Vercel.
- **Componenti di stato**: `AppLoader` (gestione caricamento iniziale) e `AuthHandler` (sincronizzazione sessione).
- **UI Globale**: `Header` è presente in tutte le pagine, mentre `RouteProgress` mostra una barra di caricamento durante la navigazione.

### Gateway di Reindirizzamento
**Percorso:** `src/app/page.tsx`
**Ruolo:** Gestore dell'atterraggio iniziale.

**Descrizione:**
La pagina radice funge da dispatcher. Non renderizza contenuti propri ma:
1. Verifica se è presente un codice di autenticazione nei parametri (callback).
2. Controlla la sessione utente tramite `supabase.auth.getUser()`.
3. Reindirizza a `/login` se l'utente non è autenticato o a `/sphere` se è già loggato.

### Sistema di Tipi
**Percorso:** `src/types/supabase.ts`
**Ruolo:** Definizioni generate per il database.

**Descrizione:**
Contiene le interfacce TypeScript che mappano esattamente lo schema del database Supabase, garantendo type-safety in tutte le operazioni di query e mutazione.

## Punti di attenzione
- **`suppressHydrationWarning`**: Abilitato sull'elemento `html` per evitare errori dovuti a discrepanze tra server e client (comune con temi o estensioni browser).
- **Rotte protette**: Il controllo dell'accesso principale avviene in `page.tsx`, ma è integrato da un middleware (se presente) o da controlli granulari nelle singole route.

## Vedi anche
- [[architettura-core]] — torna alla panoramica dell'area
- [[configurazioni-globali]] — gestione dell'ambiente
