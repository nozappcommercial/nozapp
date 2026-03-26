---
tags: [#macroarea/onboarding, #status/complete]
created: 2026-03-26
agent: scrittore
source-files: [src/app/onboarding/page.tsx, src/components/onboarding/OnboardingFlow.tsx, src/app/api/onboarding/complete/route.ts]
---

# Onboarding

[← Torna all'indice](./progetto.md)

## Scopo
La macroarea **Onboarding** gestisce la prima esperienza dell'utente in NoZapp. Il suo obiettivo è raccogliere dati sui gusti cinematografici dell'utente per inizializzare il grafo semantico della [[sphere-engine]]. Attraverso un'interfaccia interattiva, l'utente valuta una selezione di film "sonda" e definisce i propri "Pilastri", ovvero i titoli fondamentali che costituiscono il centro della sua esperienza.

## File coinvolti
| File | Ruolo |
|------|-------|
| `src/app/onboarding/page.tsx` | Server Component per il fetching iniziale dei film sonda. |
| `src/components/onboarding/OnboardingFlow.tsx` | Motore del wizard multi-fase (Welcome, Eval, Pyramid, Streaming). |
| `src/app/api/onboarding/complete/route.ts` | Endpoint API per la validazione e persistenza dei risultati. |

## Struttura e funzionamento

### 1. Inizializzazione (Server-side)
In `page.tsx`, il sistema recupera dal database i film contrassegnati come `is_onboarding_probe`. Questi sono suddivisi in tre gruppi (`onboarding_group`) per una valutazione progressiva. Viene implementata una logica di retry per gestire eventuali timeout di connessione con Supabase.

### 2. Flusso Utente (Client-side)
Il wizard in `OnboardingFlow.tsx` si articola in diverse fasi controllate dallo stato `phase`:
- **Welcome**: Introduzione poetica al concetto di "pilastri".
- **Step (Valutazione)**: L'utente valuta 15 film (3 gruppi da 5). Le reazioni possibili sono: *Loved*, *Disliked*, *Seen*, *Unseen*. Supporta interazioni swipe su mobile.
- **Confirm (La Piramide)**: Tra i film contrassegnati come *Loved*, l'utente ne sceglie fino a 6 e li ordina gerarchicamente in una piramide tramite Drag & Drop. Il vertice della piramide ha il peso maggiore nel sistema di raccomandazione.
- **Streaming**: Selezione delle piattaforme attive per personalizzare le indicazioni di disponibilità nella Sfera.

### 3. Persistenza (API Route)
L'invio dei dati viene gestito da `api/onboarding/complete/route.ts`:
- **Validazione**: Utilizza **Zod** per garantire l'integrità dei dati ricevuti.
- **Protezione**: Implementa rate-limiting e logging degli eventi di sicurezza.
- **Salvataggio**:
    - Aggiorna la flag `onboarding_complete` nella tabella `users`.
    - Inserisce i pilastri ordinati in `user_pillars`.
    - Salva l'intero batch di reazioni come configurazione JSON in `user_onboarding_results`.

### `OnboardingSchema` — `src/app/api/onboarding/complete/route.ts`
**Scopo**: Schema di validazione per i dati di onboarding.
**Esempio dal codice**:
```ts
// path: src/app/api/onboarding/complete/route.ts
const OnboardingSchema = z.object({
    pillars: z.array(z.object({
        filmId: z.union([z.string(), z.number()]),
        rank: z.number().int().min(1)
    })).min(1),
    reactions: z.record(z.string(), z.any()).optional(),
    streaming_subscriptions: z.array(z.string()).optional(),
});
```

## Relazioni con altre macroaree
- [[auth]]: L'onboarding viene tipicamente attivato subito dopo la registrazione o se la flag `onboarding_complete` è falsa.
- [[data-infrastructure]]: Utilizza i client Supabase, il logger e il sistema di rate-limiting.
- [[sphere-engine]]: Fornisce i dati necessari per generare la sfera personalizzata.

## Problemi noti
- `OnboardingFlow.tsx`: File molto esteso (1400+ righe) che gestisce troppe responsabilità (logica, UI, stili CSS).
- **Drag & Drop**: Utilizza una variabile globale `(window as any)._draggedSidebarFilm` per passare dati tra i componenti della piramide.
- **Refactoring**: Sarebbe opportuno suddividere i singoli step del wizard in componenti autonomi.

---
> ⚠️ Da verificare: Assicurarsi che la rimozione dei vecchi pilastri (`.delete().eq("user_id", user.id)`) sia atomica rispetto all'inserimento dei nuovi per evitare stati inconsistenti in caso di errore a metà processo.
