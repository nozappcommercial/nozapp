---
tags: [#onboarding, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Guida per Nuovi Collaboratori

[← Torna all'indice](./progetto.md)

## Benvenuto in NoZapp!
Questa guida ti aiuterà a configurare il tuo ambiente di sviluppo e a comprendere il workflow del team.

## Prerequisiti
Assicurati di avere installato i seguenti strumenti:
- **Node.js** (v18.0.0 o superiore)
- **Git**
- **Python** (v3.10+ se devi lavorare sulla pipeline dati)
- **VisiData** (consigliato per ispezione CSV rapide)
- **VS Code** con estensione **Obsidian Canvas** o **Markdown Links** (per navigare questa documentazione).

## Setup Iniziale del Progetto

1. **Clonazione**:
   ```bash
   git clone [url-repository] /Volumes/Crucial/workspace/web/nozapp
   cd /Volumes/Crucial/workspace/web/nozapp
   ```

2. **Ambiente**:
   Crea il file `.env.local` e richiedi le chiavi di accesso (Supabase, TMDB, Upstash) al lead developer.
   
3. **Dipendenze**:
   ```bash
   npm install
   ```

4. **Database (Opzionale)**:
   Se hai bisogno di una copia locale dello schema Supabase:
   ```bash
   npx supabase login
   npx supabase link --project-ref [project-id]
   ```

## Workflow Git

### Branch Strategy
Seguiamo un modello semplificato di Git Flow:
- **`main`**: Codice pronto per la produzione. Protetto da commit diretti.
- **`develop`**: Integrazione delle feature.
- **`feature/[nome-feature]`**: Branch dedicato allo sviluppo di nuove funzionalità.
- **`fix/[nome-bug]`**: Branch dedicato alla risoluzione di problemi.

### Convenzioni di Commit
Usa i [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: aggiunta gestione filtri nella sfera`
- `fix: corretto bug nel calcolo della shell mobile`
- `docs: aggiornamento documentazione API`
- `refactor: ottimizzazione loop rendering Three.js`

## Come Orientarsi nel Codice
Se è il tuo primo giorno, ti consigliamo di leggere i file in questo ordine:
1. [[progetto]] — Indice e stack.
2. [[architecture]] — Come dialogano i pezzi del sistema.
3. [[three-js]] — Se lavori sulla parte visuale.
4. [[api]] — Se lavori sul backend/dati.

## Supporto
Se riscontri blocchi tecnici:
- Controlla [[known-issues]] per problemi già identificati.
- Consulta i log di sicurezza in [[hooks-and-utilities]].
- Apri una Issue su Git descrivendo il problema e allegando screenshot se rilevante.

---
> [!TIP]
> NoZapp è un progetto ad alta intensità visuale. Testa sempre le tue modifiche sia su Desktop che su Mobile utilizzando i DevTools di Chrome.
