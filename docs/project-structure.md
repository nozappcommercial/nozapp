---
tags: [#structure, #status/complete]
updated: 2026-03-31
agent: aggiornatore
---

# Struttura delle Cartelle

[← Torna all'indice](./progetto.md)

## Albero di Progetto
Il progetto NoZapp segue una struttura Next.js standard ma con cartelle dedicate alla gestione dei dati e degli script di pipeline.

```text
nozapp/
├── app/                  # Next.js App Router (Pagine, Layout, API)
│   ├── (auth)/           # Route Group: Login e Recovery
│   ├── api/              # Route Handlers (Internal API)
│   ├── onboarding/       # Flusso di benvenuto utente
│   ├── admin/            # Dashboard gestionale e verifica MFA
│   ├── redazione/        # Template pubblico per gli articoli
│   └── sphere/           # Dashboard principale con la sfera 3D
├── dataset/              # Dataset CSV e script di manipolazione dati
│   ├── output/           # File generati (JSONL per seed)
│   └── *.py              # Script Python (Merge, Seed, Extract)
├── public/               # Asset statici (loghi, manifest, icone)
├── scripts/              # Utility e script di manutenzione (JS/Py)
├── utility/              # Script Python e tool esterni spostati fuori da src
│   └── *.py              # Script di arricchimento titoli (TMDB/Wikidata/Scrapers)
├── src/
│   ├── components/       # Componenti React
│   │   ├── auth/         # Gestione UI autenticazione
│   │   ├── layout/       # Header, Footer, Navigazione
│   │   ├── onboarding/   # Wizard di onboarding (OnboardingFlow.tsx, ConfirmPhase.tsx, onboarding.css.ts, types.ts, useScrollReveal.ts)
│   │   ├── sphere/       # ShellNavigator e componenti sfera
│   │   └── ui/           # Shadcn (pulsanti, input, ecc.)
│   ├── lib/              # Logica di business e utility
│   │   ├── actions/      # Next.js Server Actions
│   │   ├── graph/        # Logica di traversamento del grafo
│   │   ├── supabase/     # Client SSR e Admin
│   │   └── *.ts          # Logger, Rate-limit, Auth-utils
│   └── types/            # Definizioni TypeScript (Supabase, Film)
├── docs/                 # Documentazione del progetto (Obsidian)
├── package.json          # Dipendenze e script npm
└── tsconfig.json         # Configurazione TypeScript
```

## Convenzioni di Naming
Per mantenere la coerenza nel codebase, seguiamo queste convenzioni:

- **Componenti React**: **PascalCase** (es. `ShellNavigator.tsx`, `AuthHandler.tsx`).
- **Hook Personalizzati**: **camelCase** con prefisso `use` (es. `useIsMobile.ts`).
- **File di Logica / Utility**: **kebab-case** (es. `auth-utils.ts`, `rate-limit.ts`).
- **Variabili CSS**: **kebab-case** in `globals.css` e variabili HSL per Tailwind.
- **Cartelle App Router**: **kebab-case** per le rotte URL, **(folder)** per i Route Group.

## Ruolo delle Cartelle Chiave

### `src/components/ui/`
Contiene i componenti "atomi" generati tramite Shadcn. Questi componenti non contengono logica di business e sono altamente riutilizzabili.

### `src/lib/graph/`
Il cuore logico della navigazione. Qui risiede `traversal.ts`, che definisce come l'utente si sposta tra i nodi della sfera e quali archi vengono visualizzati.

### `dataset/`
Non è solo una cartella di asset: contiene l'intelligenza di pre-processing del progetto. È qui che il file CSV da 900k righe viene filtrato e trasformato per alimentare Supabase.

---
> [!IMPORTANT]
> Il workspace principale si trova in `/Volumes/Crucial/workspace/web/nozapp`. Evita di scrivere file al di fuori di questo percorso a meno che non sia strettamente necessario per la cache locale.

🔄 **Aggiornato il 2026-03-28**: Riorganizzazione degli script Python nella cartella `/utility` per alleggerire il watcher di Next.js e migliorare la pulizia del workspace.

---
🔄 **Aggiornato il 2026-03-26**: Inserite le nuove cartelle per l'area amministrativa e la gestione redazionale.
