updated: 2026-03-26
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
| `/onboarding`| `app/onboarding/page.tsx` | Dynamic | Root | Wizard iniziale di selezione dei pilastri del gusto. |
| `/redazione` | `app/redazione/page.tsx` | Dynamic | Root | Archivio editoriale con griglia animata dei contenuti. |
| `/redazione/[slug]` | `app/redazione/[slug]/page.tsx` | Dynamic | Root | Visualizzazione articolo singolo (Markdown + Design Immersivo). |
| `/admin` | `app/admin/page.tsx` | SSR | Admin | Dashboard gestionale per amministratori. |
| `/admin/redazione` | `app/admin/redazione/page.tsx` | SSR | Admin | Lista articoli e gestione contenuti. |
| `/admin/cinema` | `app/admin/cinema/page.tsx` | SSR | Admin | Lista film in programmazione (manuale). |
| `/admin/cinema/nuovo` | `app/admin/cinema/nuovo/page.tsx` | SSR | Admin | Form creazione nuovo film. |
| `/admin/cinema/[id]` | `app/admin/cinema/[id]/page.tsx` | SSR | Admin | Form modifica film esistente. |
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
- **OnboardingFlow**: Gestione del wizard a step e Drag & Drop.
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
- **RootLayout (`app/layout.tsx`)**: Contiene il font (`Cormorant Garamond`), lo `SplashScreen`, l'header globale e il setup delle analytics.
- **AdminLayout (`app/admin/layout.tsx`)**: Layout specifico per l'area gestionale. Utilizza il componente dinamico `AdminHeader` per mostrare il titolo della pagina corrente ("Dashboard" vs "Redazione") e fornire pulsanti di navigazione contestuali (es. "Torna alla Dashboard").
- **Auth Routes**: Utilizzano un layout semplificato che nasconde l'header globale per focalizzare l'utente sul form.

---

## Gestione degli Errori e Loading
- **loading.tsx**: UI di fallback mostrata durante il fetching dei dati (completata dallo SplashScreen client-side).
- **error.tsx**: Cattura gli errori runtime (es. fallimento connessione Supabase) e fornisce un feedback all'utente.
- **not-found.tsx**: Gestisce i percorsi non mappati.

---
> [!TIP]
> Il middleware in `src/lib/supabase/middleware.ts` è il centro di controllo del routing basato sullo stato di onboarding dell'utente e sui permessi amministrativi (MFA).

🔄 **Aggiornato il 2026-03-27**: Introdotte le rotte per la gestione manuale del Cinema (`/admin/cinema`) e la pagina di archivio editoriale (`/redazione`). Aggiornato il diagramma di flusso per l'accesso admin non-bloccante.
