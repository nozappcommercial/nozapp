---
tags: [#macroarea/data-infrastructure, #status/complete]
created: 2026-03-26
agent: scrittore
source-files: [src/lib/supabase/*, src/lib/rate-limit.ts, src/lib/logger.ts, src/lib/utils.ts]
---

# Data Infrastructure

[← Torna all'indice](./progetto.md)

## Scopo
La macroarea **Data Infrastructure** costituisce la spina dorsale dei servizi di backend di NoZapp. Gestisce la comunicazione con Supabase, l'integrazione con Redis per il rate-limiting, il sistema di logging degli eventi di sicurezza e le utility di base per lo styling. È progettata per essere resiliente ai problemi di rete e sicura contro i tentativi di abuso.

## File coinvolti
| File | Ruolo |
|------|-------|
| `src/lib/supabase/server.ts` | Client Supabase per Server Components e Actions (gestione cookie). |
| `src/lib/supabase/client.ts` | Client Supabase per componenti lato client (browser). |
| `src/lib/supabase/admin.ts` | Client privilegiato (Service Role) per operazioni di sistema. |
| `src/lib/supabase/middleware.ts` | Router centrale: gestisce sessioni e redirect di onboarding. |
| `src/lib/rate-limit.ts` | Sistema di protezione contro il flood basato su Upstash Redis. |
| `src/lib/logger.ts` | Utility di audit per eventi di sicurezza e monitoraggio API. |
| `src/lib/utils.ts` | Helper per la gestione delle classi Tailwind CSS (`cn`). |

## Struttura e funzionamento

### Integrazione Supabase (SSR)
Il progetto utilizza `@supabase/ssr` per mantenere le sessioni sincronizzate tra client e server tramite cookie. 
- Il `middleware.ts` è il cuore del routing: intercetta ogni richiesta per aggiornare il token di sessione e decidere se l'utente deve essere reindirizzato a `/login`, `/onboarding` o `/sphere` in base al suo stato nel database.

### `updateSession` — `src/lib/supabase/middleware.ts`
**Scopo**: Gestisce il refreshing dei cookie e la logica di routing condizionale.
**Esempio dal codice**:
```ts
// path: src/lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
    // ... inizializzazione client ...
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // Verifica stato onboarding
        const { data: profile } = await supabase.from('users').select('onboarding_complete').eq('id', user.id).single();
        const onboardingComplete = profile?.onboarding_complete ?? false;

        // Redirect intelligente
        if (!onboardingComplete && path !== '/onboarding') {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
    }
}
```

### Rate Limiting & Protezione
Tramite `rate-limit.ts`, NoZapp implementa limitatori a "finestra scorrevole" (sliding window) su tre livelli:
- **API**: 60 richieste al minuto.
- **Auth**: 5 tentativi ogni 15 minuti.
- **Graph**: 10 caricamenti della sfera all'ora.

### Logging di Sicurezza
La funzione `logSecurityEvent` in `logger.ts` permette di tracciare attività sospette (es. tentativi di login falliti, blocchi da rate-limit, attivazione di campi honeypot). I log vengono inviati sia alla console standard che alla tabella `security_logs` su Supabase tramite l'Admin Client.

## Relazioni con altre macroaree
- [[auth]]: Utilizza i client Supabase per la gestione delle identità e il logger per gli audit.
- [[onboarding]]: Dipende dalla logica di redirect definita nel middleware e dalla persistenza dei risultati tramite le Server Actions.
- [[sphere-engine]]: Utilizza i client per il fetching dei dati del grafo e il rate-limiting per proteggere le risorse computazionali.

## Problemi noti
- **Fallback Rate-Limit**: In ambiente di sviluppo, se Upstash non è configurato, il sistema disabilita silenziosamente la protezione per non bloccare i test.
- **Cookie Sync**: La gestione dei cookie nel middleware richiede estrema precisione per evitare loop di reindirizzamento infiniti.

---
> ⚠️ Da verificare: Assicurarsi che la variabile `ENABLE_DB_LOGGING` sia configurata correttamente in produzione per evitare la perdita di log di audit.
