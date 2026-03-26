---
tags: [#macroarea/auth, #status/complete]
created: 2026-03-26
agent: scrittore
source-files: [src/lib/auth-utils.ts, src/app/auth/callback/route.ts, src/app/(auth)/login/page.tsx, src/components/auth/AuthHandler.tsx]
---

# Auth

[← Torna all'indice](./progetto.md)

## Scopo
La macroarea **Auth** gestisce l'intero ciclo di vita dell'autenticazione degli utenti all'interno di NoZapp. Utilizza Supabase come identity provider, supportando sia l'autenticazione classica (email/password) che OAuth (Google). Gestisce inoltre la persistenza delle sessioni lato server (SSR) e il reindirizzamento intelligente basato sullo stato di completamento dell'onboarding.

## File coinvolti
| File | Ruolo |
|------|-------|
| `src/lib/auth-utils.ts` | Helper lato server per protezione rotte e verifica proprietà. |
| `src/app/auth/callback/route.ts` | Endpoint di callback per lo scambio del codice di sessione Supabase. |
| `src/app/(auth)/login/page.tsx` | UI unica per Login, Registrazione, Reset e Update password. |
| `src/components/auth/AuthHandler.tsx` | Componente client per la pulizia dei token sensibili dall'URL. |

## Struttura e funzionamento

### Flusso di Autenticazione
Il sistema utilizza il flusso di autenticazione basato su codice di Supabase. Quando un utente effettua il login o conferma l'email, viene reindirizzato a `/auth/callback`, dove il codice viene scambiato per una sessione persistente.

### Protezione delle Risorse
Viene implementata una protezione "defense-in-depth" tramite helper centralizzati in `auth-utils.ts` che possono essere usati nelle Server Actions o nelle API Routes.

### `ensureAuthenticated` — `src/lib/auth-utils.ts`
**Scopo**: Verifica che l'utente sia autenticato prima di procedere con un'operazione.
**Dipendenze**: [[data-infrastructure]]
**Esempio dal codice**:
```tsx
// path: src/lib/auth-utils.ts
export async function ensureAuthenticated() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        throw new Error("Unauthorized: Deve essere effettuato il login per accedere a questa risorsa.");
    }
    
    return user;
}
```

### `AuthPage` — `src/app/(auth)/login/page.tsx`
**Scopo**: Gestisce tutte le visualizzazioni di autenticazione in un'unica pagina tramite stati React (`login`, `register`, `reset`, `update-password`).
**Dipendenze**: [[data-infrastructure]] (logger, supabase client)
**Note**: Include un campo "honeypot" per prevenire bot e integra un sistema di logging degli eventi di sicurezza.

### `AuthHandler` — `src/components/auth/AuthHandler.tsx`
**Scopo**: Monitora i cambiamenti di stato dell'autenticazione sul client. In particolare, intercetta l'evento `PASSWORD_RECOVERY` per reindirizzare l'utente alla vista di aggiornamento password e pulisce l'URL dai token sensibili (`access_token`, `recovery_token`) dopo che Supabase li ha processati.
**Esempio dal codice**:
```tsx
// path: src/components/auth/AuthHandler.tsx
const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
        window.location.href = '/login?view=update-password';
        return;
    }
    // ... pulizia hash sensibili
});
```

## Relazioni con altre macroaree
- [[data-infrastructure]]: Fornisce i client Supabase e il logger per gli eventi di sicurezza.
- [[onboarding]]: Il callback di autenticazione reindirizza gli utenti non ancora "onboarded" a questo flusso.
- [[ui-system]]: Fornisce la coerenza visiva e i componenti base utilizzati nella pagina di login.

## Problemi noti
- `login/page.tsx`: Utilizza `window.location.href` anziché `useRouter` di Next.js in diversi punti.
- `auth-utils.ts`: Presenta un piccolo refuso grammaticale nel messaggio di errore ("Devono essere effettuato").
- `callback/route.ts`: Manutenzione manuale della sincronizzazione tabella `users` tramite `upsert`.

> ⚠️ Da verificare: Lo stato `onboarding_complete` viene letto direttamente dalla tabella `users` in `callback/route.ts`. Assicurarsi che i trigger di database (se presenti) siano allineati.
