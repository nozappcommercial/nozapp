---
tags: [#dependencies, #status/complete]
created: 2026-03-26
agent: scrittore
---

# Dipendenze

[← Torna all'indice](./progetto.md)

## Dipendenze di Produzione (`dependencies`)
NoZapp seleziona accuratamente librerie ad alte prestazioni per garantire fluidità nella visualizzazione 3D.

### Core Framework
- **`next`**: Framework Full-stack (App Router).
- **`react` / `react-dom`**: Libreria UI.
- **`typescript`**: Linguaggio base per la tipizzazione.

### Motore 3D e Animazioni
- **`three`**: Il core del rendering WebGL per la Sfera Semantica.
- **`framer-motion`**: Gestisce le transizioni dei componenti React e le micro-interazioni UI.
- **`animejs`**: Utilizzata per lo scroll fluido e controllato delle sezioni nell'header.

### Backend e Utility
- **`@supabase/supabase-js`** e **`@supabase/ssr`**: Integrazione completa con Supabase (Auth, DB, Cookies).
- **`@upstash/ratelimit`** e **`@upstash/redis`**: Servizi Redis per la protezione contro il flood delle API.
- **`zod`**: Schema validation per tutte le API e le Server Actions.
- **`clsx`** / **`tailwind-merge`**: Utility per la gestione dinamica delle classi CSS.

### UI e Icone
- **`lucide-react`**: Set di icone vettoriali leggere.
- **`shadcn/ui`**: Componenti accessibili presi da Radix UI (non installati come pacchetti, ma copiati in `src/components/ui`).

## Dipendenze di Sviluppo (`devDependencies`)
Strumenti utilizzati durante il processo di build e test.

- **`tailwindcss`**: Framework CSS basato su utility.
- **`vitest`**: Framework di testing unitario (alternativa veloce a Jest).
- **`postcss`** / **`autoprefixer`**: Post-processori per il CSS.
- **`eslint`**: Linter per mantenere la qualità del codice.

---

### Note sul Versionamento
> [!IMPORTANT]
> A causa della natura sperimentale della versione **Next.js 15+**, alcune dipendenze potrebbero essere fissate (pinned) per evitare incompatibilità nel middleware di Supabase o nelle Server Actions. Controlla sempre il file `package.json` prima di eseguire un `npm update`.

---
> [!TIP]
> Per aggiungere nuove dipendenze, utilizza `npm install [package-name]` per mantenere sincronizzato il file `package-lock.json`.
