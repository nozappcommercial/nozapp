# Pagine e Routing

NoZapp utilizza l'App Router di Next.js 14 per gestire la navigazione. La maggior parte delle rotte è protetta o gestisce stati di onboarding.

## Mappa delle Rotte

| Percorso URL | File File System | Rendering | Layout | Descrizione |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | SSR (Redirect) | `RootLayout` | Reindirizza automaticamente alla Sfera (`/sphere`). |
| `/sphere` | `src/app/sphere/page.tsx` | Client-Side (WebGL) | `RootLayout` | Pagina principale con la Sfera Semantica 3D. |
| `/onboarding` | `src/app/onboarding/page.tsx` | Client-Side | `RootLayout` | Flusso di configurazione iniziale per nuovi utenti. |
| `/auth` | `src/app/auth/**` | Server-Side | `RootLayout` | Gestione dei callback di autenticazione Supabase. |
| `/(auth)/login` | `src/app/(auth)/login/page.tsx` | Client-Side | `RootLayout` | Pagina di login/registrazione. |

## Logica di Navigazione

1.  **Redirect Iniziale**: La root `/` esegue un redirect permanente o temporaneo verso `/sphere` per portare l'utente subito nel vivo dell'esperienza.
2.  **Protezione Rotte**: Sebbene non ci sia un middleware complesso visibile, le rotte sensibili verificano la sessione Supabase.
3.  **Onboarding**: Durante l'onboarding, l'header principale viene nascosto (`Header.tsx` riga 41) per focalizzare l'utente sul processo di setup.

## Struttura del Layout

Tutte le pagine sono wrappate dal `RootLayout` (`src/app/layout.tsx`), che fornisce:
*   Configurazione dei Font (Cormorant Garamond, Fragment Mono).
*   Componente `SplashScreen`.
*   Componente `Header`.
*   Analytics di Vercel.

---
[← Torna all'indice](./index.md)
