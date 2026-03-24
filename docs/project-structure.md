# Struttura delle Cartelle

NoZapp segue una struttura standard di un progetto Next.js 14 con una chiara separazione tra logica server, logica client e asset statici.

## Albero del Progetto

```text
nozapp/
├── dataset/             # File CSV cinematografici e script di elaborazione locale
├── docs/                # Documentazione del progetto (questa directory)
├── public/              # Asset statici (loghi, manifest, manifest.json)
├── sandbox/             # Prototipi isolati e test di componenti UI (Beta)
├── scripts/             # Automazioni, script Python per Wikidata e seeding DB
├── src/
│   ├── app/             # Next.js App Router (Layout, Pagine, API, Actions)
│   ├── components/      # Componenti React (UI, Layout, Sphere)
│   ├── hooks/           # Hook personalizzati per lo stato client
│   ├── lib/             # Utility di sistema, client Supabase, logica del grafo
│   ├── proxy.ts         # Proxy di sistema (se presente)
│   └── types/           # Definizioni TypeScript e interfacce DB
├── supabase/            # Configurazioni e migrazioni SQL per Supabase
├── next.config.mjs      # Configurazione Next.js
├── package.json         # Dipendenze e script npm
├── tailwind.config.ts   # Configurazione Tailwind CSS
└── tsconfig.json        # Configurazione TypeScript
```

## Dettaglio del Workspace

*   **Ubicazione fisica**: `/Volumes/Crucial/workspace/web/nozapp`
*   **Convenzioni di Naming**:
    *   **Componenti**: PascalCase (es. `Header.tsx`, `SemanticSphere.tsx`)
    *   **Hook**: camelCase con prefisso `use*` (es. `useSphere.ts`)
    *   **Utility/Lib**: camelCase (es. `traversal.ts`)
    *   **Stili**: CSS Modules con nome `.module.css` o Tailwind utility classes.

## Ruolo delle Cartelle Principali

### `src/app`
Contiene la logica dell'App Router. Ogni cartella rappresenta una rotta URL. Include `actions/` per le Server Actions e `api/` per gli endpoint REST.

### `src/components`
Suddivisa in aree funzionali:
*   `ui/`: Componenti base (bottoni, input, splash screen).
*   `layout/`: Struttura portante (Header).
*   `sphere/`: Logica specifica per la visualizzazione 3D.

### `scripts`
Cruciale per la gestione del dataset. Contiene script Python (`title-it.py`) per l'arricchimento dei dati e script JavaScript/MJS per l'integrazione con Supabase.

### `dataset`
Contiene i dati grezzi e processati in formato CSV. È il punto di partenza per ogni visualizzazione nell'app.

---
[← Torna all'indice](./index.md)
