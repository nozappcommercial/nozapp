---
tags: [#todo, #status/active]
created: 2026-03-27
agent: analista
source-docs: [[api]], [[architecture]], [[components]], [[configuration]], [[data-flow]], [[dataset]], [[dependencies]], [[editorial-system]], [[hooks-and-utilities]], [[known-issues]], [[onboarding-guide]], [[pages-and-routing]], [[progetto]], [[project-structure]], [[scripts]], [[security]], [[three-js]], [[types]]
---

# TODO — NoZapp

> Generato automaticamente da Agente Analista.
> Alimenta Agente Meccanico con: /meccanico

---

## P1 — Critico

| #      | Problematica                      | Macroarea          | Documentazione   |
| ------ | --------------------------------- | ------------------ | ---------------- |
| ✅ P1-001 | Non esporre mai le API Key (`TMDB_API_KEY`, `RAPIDAPI_KEY`) sul lato client. | [[api]] | [[api]] completed: 2026-03-27 |

## P2 — Alto

| #        | Problematica                                                                      | Macroarea             | Documentazione                       |
| -------- | --------------------------------------------------------------------------------- | --------------------- | ------------------------------------ |
| ✅ P2-001 | Il componente `SemanticSphere.tsx` utilizza `@ts-nocheck` (complessità Three.js). | [[three-js]]          | [[three-js]] completed: 2026-03-27   |
| ✅ P2-002 | La variabile `CRON_SECRET` è critica; non utilizzarla per altri scopi.            | [[security]]          | [[known-issues]]                     |
| ✅ P2-003 | Alcune dipendenze (Next.js 15+) potrebbero essere fissate per stabilità.          | [[dependencies]]      | [[dependencies]]                     |
| ✅ P2-004 | Non modificare manualmente `movies.csv`; usare sempre gli script della pipeline.  | [[dataset]]           | [[dataset]]                          |
| ✅ P2-005 | Rigenerare i tipi Supabase dopo ogni modifica strutturale del database.           | [[types]]             | [[types]]                            |
| ✅ P2-006 | Il workspace principale è `/Volumes/Crucial/workspace/web/nozapp`.                | [[project-structure]] | [[project-structure]]                |
| ✅ P2-008 | Affinamento UI Admin (Verifica, Centramento, Tasto Ritorno Sfera).                | [[components]]        | [[components]] completed: 2026-03-27 |
| ✅ P2-009 | Feedback visivi OTP (Errore/Successo) e Reinvio Email.                            | [[components]]        | [[components]] completed: 2026-03-27 |

## P3 — Medio

| #      | Problematica                      | Macroarea          | Documentazione   |
| ------ | --------------------------------- | ------------------ | ---------------- |
| ✅ P3-001 | Preferire le utility in `src/lib/` anziché logica low-level nei componenti. | [[hooks-and-utilities]] | [[hooks-and-utilities]] completed: 2026-03-27 |

## P4 — Basso

| #      | Problematica                      | Macroarea          | Documentazione   |
| ------ | --------------------------------- | ------------------ | ---------------- |
| P4-001 | Middleware in `src/lib/supabase/middleware.ts` è il centro del controllo routing. | [[api]] | [[pages-and-routing]] |
| P4-002 | Il flusso dei dati è asincrono; i poster vengono recuperati on-demand. | [[data-flow]] | [[data-flow]] |
| P4-003 | Utilizzare `npm install` per mantenere sincronizzato `package-lock.json`. | [[dependencies]] | [[dependencies]] |
| P4-004 | Approccio "Defense-in-Depth" (RLS, MFA, Zod) per la sicurezza. | [[architecture]] | [[architecture]] |
| P4-005 | Testare le modifiche sia su Desktop che su Mobile via Chrome DevTools. | [[onboarding-guide]] | [[onboarding-guide]] |
| P4-006 | Configurare CSP e Headers di sicurezza in `next.config.mjs`. | [[configuration]] | [[configuration]] |

---

## Riepilogo

| Priorità   | Totale voci |
| ---------- | ----------- |
| P1         | 1           |
| P2         | 7           |
| P3         | 1           |
| P4         | 6           |
| **Totale** | **16**      |

---

## Output finale

✅ Analisi completata. Trovate 14 voci totali.
1 critiche, 6 alte, 1 medie, 6 basse.
Puoi ora avviare il Meccanico con /meccanico [codice]
oppure /meccanico per lavorare dall'alto verso il basso.
