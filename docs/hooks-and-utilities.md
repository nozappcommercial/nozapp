---
tags: [#utilities, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Hook e Utility

[← Torna all'indice](./progetto.md)

## Custom Hooks
NoZapp utilizza pochi ma critici hook personalizzati per gestire lo stato della UI e la responsività.

### `useIsMobile` — `src/hooks/use-is-mobile.ts`
**Scopo**: Hook centralizzato che rileva se l'utente sta navigando da un dispositivo mobile basandosi sulla larghezza della finestra (`< 768px`).
**Ritorna**: `boolean`. Utilizza un `ResizeObserver` per una reattività ottimale.

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

### `auth-client.ts` — `src/lib/supabase/auth-client.ts`
**Scopo**: Utility client-side per la verifica rapida dei permessi amministrativi.
- **Funzione**: `checkAdminStatus()`
- **Utilizzo**: Previene il rendering di elementi UI admin per utenti non autorizzati prima ancora del controllo middleware.

### `scroll-utils.ts` — `src/lib/scroll-utils.ts`
**Scopo**: Centralizza le animazioni di scroll fluido utilizzando `animejs`.
- **Funzione**: `scrollToSection(id)`
- **Vantaggio**: Carica `animejs` in modo asincrono solo quando necessario, riducendo il bundle iniziale.

### `utils.ts` — Tailwind Merge
**Funzione**: `cn(...inputs)`
**Scopo**: Unisce classi Tailwind in modo intelligente, risolvendo i conflitti (wrapper su `clsx` e `tailwind-merge`).

---
🔄 **Aggiornato il 2026-03-27**: Centralizzazione di `useIsMobile`, introduzione di `auth-client` e `scroll-utils` per migliorare la modularità.
File modificati: `src/hooks/use-is-mobile.ts`, `src/lib/supabase/auth-client.ts`, `src/lib/scroll-utils.ts`

## Logica del Grafo
### `traversal.ts` — `src/lib/graph/traversal.ts`
Contiene la logica pura per navigare tra i film:
- **`buildNavContext`**: Calcola visibilità, vicini e gerarchia basata sui livelli (shells).
- **`neighbors`**: Identifica i nodi connessi ad un determinato film ID.

---
> [!TIP]
> Preferisci sempre l'utilizzo delle utility in `src/lib/` anziché implementare logica di basso livello direttamente nei componenti per mantenere il codice DRY e sicuro.
