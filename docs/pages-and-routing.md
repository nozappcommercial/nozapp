updated: 2026-03-28
agent: aggiornatore
---

# Pagine e Routing

[← Torna all'indice](./progetto.md)

## Mappa delle Rotte
NoZapp utilizza l'**App Router** di Next.js 14 per gestire la navigazione. La maggior parte delle rotte è protetta tramite middleware.

| Percorso URL | File Sorgente | Rendering | Layout | Scopo |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | SSR | Root | Landing page o redirect automatico alla sfera. |
| `/login` | `app/(auth)/login/page.tsx` | CSR | Root | Autenticazione utente (Email/Password + Magic Link). |
| `/auth/confirmed` | `app/auth/confirmed/page.tsx` | SSR | Root | Pagina di successo dopo la conferma dell'email. |
| `/onboarding`| `app/onboarding/page.tsx` | Dynamic | Root | Wizard iniziale di selezione dei pilastri del gusto (3D/2D Hybrid). |
| `/redazione` | `app/redazione/page.tsx` | Dynamic | Root | Informazioni redazionali e visione del progetto. |
| `/redazione/[slug]` | `app/redazione/[slug]/page.tsx` | Dynamic | Root | Visualizzazione articolo singolo (Hero Title-first + Design Immersivo). |
| `/archivio` | `app/archivio/page.tsx` | Dynamic | Root | Biblioteca digitale completa degli articoli pubblicati. |
| `/manifesto` | `app/manifesto/page.tsx` | Static | Root | Pagina dedicata alla visione "slow" e curatoriale. |
| `/contatti` | `app/contatti/page.tsx` | Static | Root | Pagina minimale per feedback e canali social. |
| `/admin` | `app/admin/page.tsx` | SSR | Admin | Dashboard gestionale con System Vitals. |
| `/admin/redazione` | `app/admin/redazione/page.tsx` | SSR | Admin | Lista articoli (vista responsive card/tabella). |
| `/admin/utenti` | `app/admin/utenti/page.tsx` | SSR | Admin | Gestione iscritti, filtri demografici e permessi. |
| `/admin/analisi` | `app/admin/analisi/page.tsx` | SSR | Admin | Dashboard analytics (engagement, demografica). |
| `/admin/cinema` | `app/admin/cinema/page.tsx` | SSR | Admin | Gestione manuale del carosello "Ora al Cinema". |
| `/admin/verify` | `app/admin/verify/page.tsx` | CSR | Root | Verifica MFA (Multi-Factor Authentication). |

## Strategie di Rendering

### Server Components (RSC)
Le pagine `/` e `/sphere` agiscono come Server Components per:
- Recuperare i dati dal database (Supabase) in modo sicuro.
- Minimizzare il bundle JavaScript inviato al browser.
- Gestire il `metadata` dynamicamente (titoli e descrizioni).

### Client Components
I componenti critici per l'interazione sono isolati come Client Components:
- **Auth Forms**: Validazione input e chiamate `supabase.auth`.
- **OnboardingFlow**: Wizard a step con logica di rating cinematografico, piramide 2x3 mobile e gestione Bottom Sheet.
- **SemanticSphere**: Rendering WebGL e loop Three.js.

## Flusso di Navigazione

### 1. Ciclo di Vita della Sessione
```mermaid
graph TD
    Start((Accesso)) --> Mid{Middleware}
    Mid -- No Auth --> Login[/login]
    Mid -- Auth & No Onb --> Onb[/onboarding]
    Mid -- Auth & Onb OK --> Sph[/sphere]
    Sph -- Admin Gear Icon --> MFA{MFA Verified?}
    MFA -- No --> Verify[/admin/verify]
    MFA -- Yes --> Dash[/admin]
    Login -- Success --> Onb
    Onb -- Success --> Sph
    Verify -- Success --> Dash
```

### 2. Layouts
- **RootLayout (`app/layout.tsx`)**: Contiene il font (`Cormorant Garamond`), lo `SplashScreen`, l'header globale, il setup delle analytics e il componente `RouteProgress` (avvolto in `Suspense`) per il feedback visivo di caricamento e il reset automatico dello scroll.
- **AdminLayout (`app/admin/layout.tsx`)**: Layout specifico per l'area gestionale. Utilizza il componente dinamico `AdminHeader` per mostrare il titolo della pagina corrente ("Dashboard" vs "Redazione") e fornire pulsanti di navigazione contestuali. Garantisce la stabilità del middleware tramite l'uso di link standard (`<a>`) per le transizioni area pubblica/admin.
- **Editorial Routes**: Le pagine sotto `/redazione`, `/manifesto`, `/archivio`, `/contatti` utilizzano un design "Hero Title-first" che nasconde l'header globale per favorire l'immersività. Includono il componente `BackToTop`.

---

## Gestione degli Errori e Loading
- **loading.tsx**: UI di fallback mostrata durante il fetching dei dati (completata dallo SplashScreen client-side).
- **error.tsx**: Cattura gli errori runtime (es. fallimento connessione Supabase) e fornisce un feedback all'utente.
- **not-found.tsx**: Gestisce i percorsi non mappati.

---
> [!TIP]
> Il middleware in `src/lib/supabase/middleware.ts` è il centro di controllo del routing basato sullo stato di onboarding dell'utente e sui permessi amministrativi (MFA).

🔄 **Aggiornato il 2026-03-30**: Introdotta la rotta `/auth/confirmed` per il successo della verifica email. Ottimizzato il middleware per gestire il redirect automatico post-conferma.
File modificati: `src/app/auth/confirmed/page.tsx`, `src/app/auth/callback/route.ts`, `src/app/page.tsx`
