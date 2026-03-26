---
tags: [#utilities, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Hook e Utility

[← Torna all'indice](./progetto.md)

## Custom Hooks
NoZapp utilizza pochi ma critici hook personalizzati per gestire lo stato della UI e la responsività.

### `useIsMobile` — `src/components/onboarding/OnboardingFlow.tsx`
**Scopo**: Rileva se l'utente sta navigando da un dispositivo mobile basandosi sulla larghezza della finestra (`< 640px`).
**Ritorna**: `boolean | undefined`.

### `useLayoutEffect` (Scroll Spy) — `src/components/layout/Header.tsx`
Utilizzato all'interno del componente Header per sincronizzare la posizione della "Bubble Nav" con il ridimensionamento della finestra e lo scroll della pagina.

## Utility di Sistema (`src/lib/`)
Le utility in `lib/` gestiscono le operazioni trasversali a tutta l'applicazione.

### Supabase Clients — `src/lib/supabase/`
Il progetto separa nettamente i contesti di esecuzione:
- **`client.ts`**: Per chiamate browser-side (es. logout).
- **`server.ts`**: Per Server Components e Server Actions (gestione sicura dei cookie).
- **`admin.ts`**: Utilizza il `service_role` per bypassare le RLS (operazioni batch, cron, seed).

### `logger.ts` — Security Auditing
**Scopo**: Registra eventi critici sia sulla console server che nella tabella `security_logs`.
**Eventi tracciati**: `auth_failure`, `rate_limit_block`, `honeypot_hit`, `suspicious_traffic`.

### `rate-limit.ts` — Flood Protection
**Scopo**: Implementa il rate-limiting tramite Upstash Redis.
- **API**: 60 req/min.
- **Auth**: 5 req / 15 min.
- **Graph**: 10 req / hour.

### `auth-utils.ts` — Route Guards
Utility per la protezione delle rotte lato server:
- `ensureAuthenticated()`: Lancia un errore se la sessione non è valida.
- `verifyOwnership(userId)`: Verifica che l'utente loggato sia il proprietario della risorsa richiesta.

### `utils.ts` — Tailwind Merge
**Funzione**: `cn(...inputs)`
**Scopo**: Unisce classi Tailwind in modo intelligente, risolvendo i conflitti (wrapper su `clsx` e `tailwind-merge`).

---

## Logica del Grafo
### `traversal.ts` — `src/lib/graph/traversal.ts`
Contiene la logica pura per navigare tra i film:
- **`buildNavContext`**: Calcola visibilità, vicini e gerarchia basata sui livelli (shells).
- **`neighbors`**: Identifica i nodi connessi ad un determinato film ID.

---
> [!TIP]
> Preferisci sempre l'utilizzo delle utility in `src/lib/` anziché implementare logica di basso livello direttamente nei componenti per mantenere il codice DRY e sicuro.
