---
titolo: "Pipeline e Deploy"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: sviluppo-strumenti
---

# Pipeline e Deploy

## Panoramica
Il deploy di nozapp è ottimizzato per l'ecosistema Vercel, sfruttando le funzionalità native di Next.js per il rendering lato server e la distribuzione edge degli asset.

## Analisi tecnica

### Piattaforma di Hosting (Vercel)
**Configurazione:**
- **Build Step**: Esegue `npm run build` che compila i Server Components e genera le route statiche.
- **Analytics & Speed Insights**: Integrati tramite i pacchetti vercel ufficiali (`package.json`) per monitorare le performance reali nel tempo.
- **Environment Variables**: Gestite tramite la dashboard di Vercel, caricate separatamente per ambienti `production`, `preview` e `development`.

### CI/CD
Attualmente la pipeline di deploy è gestita tramite l'integrazione diretta Git-to-Vercel. Ogni push sul branch `main` triggera un deploy in produzione, mentre i push sui branch di feature generano delle "Preview Deploy" per il testing prima del merge.

## Punti di attenzione
- **Database Migrations**: Le migrazioni di Supabase devono essere eseguite manualmente o tramite script (`reset_user.mjs`) prima del deploy del codice che dipende dai nuovi schemi.
- **Cold Start**: Monitorare i tempi di caricamento del motore 3D in produzione per verificare l'efficacia del caching delle Server Actions.

## Vedi anche
- [[sviluppo-strumenti]] — torna alla panoramica dell'area
- [[areas/infrastruttura/gestione-database-cache]] — infrastruttura DB collegata
