---
titolo: "Configurazioni Globali"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: architettura-core
---

# Configurazioni Globali

## Panoramica
Gestione centralizzata delle variabili d'ambiente e delle costanti di sistema. Il progetto utilizza un approccio rigoroso alla validazione dei dati per prevenire errori a runtime dovuti a chiavi mancanti o malformate.

## Analisi tecnica

### Configurazione Server-Side
**Percorso:** `src/lib/config.ts`
**Ruolo:** Validazione e accesso sicuro alle variabili d'ambiente.

**Descrizione:**
Utilizza la libreria `zod` per definire uno schema dei dati attesi. Questo garantisce che:
- Le URL di Supabase siano stringhe valide.
- Le chiavi segrete (Service Role) siano presenti.
- Le chiavi API opzionali (TMDB, RapidAPI) vengano gestite correttamente.

**Firma esposta:**
```typescript
export const config: {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  TMDB_API_KEY?: string;
  RAPIDAPI_KEY?: string;
  CRON_SECRET?: string;
}
```

### Utility Helper
**Percorso:** `src/lib/utils.ts`
**Ruolo:** Funzioni di utilità generale.

**Descrizione:**
Esporta la funzione `cn` (class name merge), uno standard moderno per combinare classi Tailwind utilizzando `clsx` e `tailwind-merge`, risolvendo automaticamente i conflitti tra utility classes.

## Punti di attenzione
- **`server-only`**: Il file `config.ts` importa `server-only` per assicurarsi che le variabili sensibili (come il Service Role Key) non finiscano mai nel bundle del client.
- **Validazione in build**: Lo script permette alla build di procedere anche in mancanza di segreti su Vercel, ma fallisce rigorosamente in produzione standard se mancano variabili critiche.

## Vedi anche
- [[architettura-core]] — torna alla panoramica dell'area
- [[struttura-nextjs]] — come queste config vengono usate nel layout
