---
tags: [#routing, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Pagine e Routing

[← Torna all'indice](./progetto.md)

## Mappa delle Rotte
NoZapp utilizza l'**App Router** di Next.js 14 per gestire la navigazione. La maggior parte delle rotte è protetta tramite middleware.

| Percorso URL | File Sorgente | Rendering | Layout | Scopo |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | SSR | Root | Landing page o redirect automatico alla sfera. |
| `/login` | `app/(auth)/login/page.tsx` | CSR | Root | Autenticazione utente (Email/Password + Magic Link). |
| `/onboarding`| `app/onboarding/page.tsx` | Dynamic | Root | Wizard iniziale di selezione dei pilastri del gusto. |
| `/sphere` | `app/sphere/page.tsx` | Dynamic | Root | Schermata principale con il grafo 3D interattivo. |

## Strategie di Rendering

### Server Components (RSC)
Le pagine `/` e `/sphere` agiscono come Server Components per:
- Recuperare i dati dal database (Supabase) in modo sicuro.
- Minimizzare il bundle JavaScript inviato al browser.
- Gestire il `metadata` dynamicamente (titoli e descrizioni).

### Client Components
I componenti critici per l'interazione sono isolati come Client Components:
- **Auth Forms**: Validazione input e chiamate `supabase.auth`.
- **OnboardingFlow**: Gestione del wizard a step e Drag & Drop.
- **SemanticSphere**: Rendering WebGL e loop Three.js.

## Flusso di Navigazione

### 1. Ciclo di Vita della Sessione
```mermaid
graph LR
    Start((Accesso)) --> Mid{Middleware}
    Mid -- No Auth --> Login[/login]
    Mid -- Auth & No Onb --> Onb[/onboarding]
    Mid -- Auth & Onb OK --> Sph[/sphere]
    Login -- Success --> Onb
    Onb -- Success --> Sph
```

### 2. Layouts
- **RootLayout (`app/layout.tsx`)**: Contiene il font (`Cormorant Garamond`), lo `SplashScreen`, l'header globale e il setup delle analytics.
- **Auth Routes**: Utilizzano un layout semplificato che nasconde l'header globale per focalizzare l'utente sul form.

---

## Gestione degli Errori e Loading
- **loading.tsx**: UI di fallback mostrata durante il fetching dei dati (completata dallo SplashScreen client-side).
- **error.tsx**: Cattura gli errori runtime (es. fallimento connessione Supabase) e fornisce un feedback all'utente.
- **not-found.tsx**: Gestisce i percorsi non mappati.

---
> [!TIP]
> Il middleware in `src/lib/supabase/middleware.ts` è il centro di controllo del routing basato sullo stato di onboarding dell'utente.
