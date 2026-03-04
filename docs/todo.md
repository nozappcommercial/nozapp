# TODO — Task Board

> Questo file è il task board condiviso tra tutti gli agenti.
> Ogni task deve avere un assegnatario (agente), una priorità e uno stato.
> Il **Docs Agent** è responsabile di mantenerlo aggiornato.

**Legenda stato:** 🔲 Da fare · 🔄 In corso · ✅ Fatto · 🚫 Bloccato

---

## 🔴 PRIORITÀ ALTA

### Setup & Infrastruttura
| # | Task | Agente | Stato |
|---|---|---|---|
| 1 | Inizializzare progetto Next.js 14 con App Router e TypeScript strict | Frontend | 🔲 |
| 2 | Configurare Tailwind CSS + shadcn/ui | Frontend | 🔲 |
| 3 | Setup Supabase project + connessione Next.js (con `@supabase/ssr`) | Backend | 🔲 |
| 4 | Creare schema DB: `films`, `editorial_edges`, `users`, `user_pillars` | Backend | 🔲 |
| 5 | Attivare RLS e scrivere policies per ogni tabella | Backend | 🔲 |
| 6 | Generare tipi TypeScript da Supabase CLI → `src/types/supabase.ts` | Backend | 🔲 |
| 7 | Configurare middleware per protezione route autenticate | Backend | 🔲 |

### Seed Dati Editoriali
| # | Task | Agente | Stato |
|---|---|---|---|
| 8 | Creare seed script per tabella `films` (film iniziali del grafo) | Backend | 🔲 |
| 9 | Creare seed script per tabella `editorial_edges` (archi curati) | Backend | 🔲 |

---

## 🟡 PRIORITÀ MEDIA

### Auth & Onboarding
| # | Task | Agente | Stato |
|---|---|---|---|
| 10 | Implementare route `/login` con Supabase magic link | Frontend | 🔲 |
| 11 | Progettare e implementare form psicografico `/onboarding` | Frontend | 🔲 |
| 12 | Implementare Server Action `savePillars()` | Backend | 🔲 |
| 13 | Logica redirect onboarding → sphere dopo completamento | Backend | 🔲 |

### Sfera Semantica
| # | Task | Agente | Stato |
|---|---|---|---|
| 14 | Convertire prototipo HTML Three.js in componente `SemanticSphere.tsx` | Frontend | 🔄 |
| 15 | Estrarre logica Three.js in `SphereScene.ts` (puro JS, no React) | Frontend | 🔲 |
| 16 | Implementare Server Action `getEditorialGraph()` | Backend | 🔲 |
| 17 | Connettere `SpherePage` a dati reali Supabase | Backend | 🔲 |
| 18 | Implementare `getRecommendations()` con BFS sul grafo | Backend | 🔲 |

---

## 🟢 PRIORITÀ BASSA

### Features Secondarie
| # | Task | Agente | Stato |
|---|---|---|---|
| 19 | Pagina dettaglio film `/film/[id]` | Frontend | 🔲 |
| 20 | Pagina profilo `/profile` con modifica pilastri | Frontend | 🔲 |
| 21 | Implementare `updateProfile()` Server Action | Backend | 🔲 |
| 22 | Animazione di transizione onboarding → sfera | Frontend | 🔲 |
| 23 | Ottimizzazione: cache `getEditorialGraph()` con `unstable_cache` | Backend | 🔲 |

### Documentazione
| # | Task | Agente | Stato |
|---|---|---|---|
| 24 | Completare `architecture.md` con schema DB definitivo dopo setup Supabase | Docs | 🔲 |
| 25 | Aggiornare `doc.md` dopo ogni componente implementato | Docs | 🔄 |
| 26 | Documentare API pubbliche dei componenti `sphere/` | Docs | 🔲 |

---

## Note per gli Agenti

- Prima di iniziare un task, aggiorna lo stato a 🔄 in questo file.
- Alla fine di ogni task, aggiorna lo stato a ✅ e aggiungi eventuali note.
- Se un task è bloccato da un dipendente, segnalalo con 🚫 e specifica il motivo nelle note.
- I task #4, #5, #6 sono prerequisiti per qualsiasi lavoro su Supabase.
- Il task #14 (Sfera) può procedere in parallelo con il backend usando dati mock.
