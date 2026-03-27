updated: 2026-03-26
agent: aggiornatore
---

# Componenti UI

[← Torna all'indice](./progetto.md)

## Panoramica
I componenti di NoZapp sono suddivisi in **UI atomici** (Shadcn), **Layout** (struttura fissa) e **Functional** (logica specifica). Questa sezione documenta i componenti principali non legati direttamente a Three.js.

## Componenti Specifici

### `ShellNavigator` — `src/components/sphere/ShellNavigator.tsx`
**Scopo**: Gestisce la navigazione tra i livelli di astrazione (Pilastri, Affinità, Scoperta) della sfera.
**Responsabilità**: Visualizzare il livello corrente, gestire l'hover per espandere le label e triggerare il cambio di shell nello Sphere Engine.
**Nota Layout**: Il posizionamento è delegato al contenitore genitore per garantire la centratura verticale e il corretto padding dal bordo sinistro.

| Prop | Tipo | Default | Obbligatorio | Descrizione |
| :--- | :--- | :--- | :--- | :--- |
| `activeShell` | `ShellLevel (0\|1\|2)` | - | Sì | Il livello di shell attualmente attivo. |
| `onShellChange` | `(shell: ShellLevel) => void` | - | No | Callback chiamata al click su un livello. |
| `isAnimating` | `boolean` | `false` | No | Disabilita i click durante le transizioni 3D. |
| `variant` | `'default' \| 'compact'` | `'default'` | No | Cambia lo stile visivo (compact per mobile). |
| `orientation` | `'horizontal' \| 'vertical'`| `'horizontal'`| No | Orientamento del navigatore. |

**Dipendenze**: Nessuna esterna. Utilizza stili inline per le animazioni.

---

### `ProfileModal` — `src/components/profile/ProfileModal.tsx`
**Scopo**: Interfaccia per la gestione del profilo utente e accesso alle impostazioni.
**Caratteristiche**:
- **Centratura**: Implementata tramite flex-container dedicato per evitare conflitti tra CSS `transform` e animazioni Framer Motion.
- **Micro-interazioni**: Animazione di ingresso/uscita sulla scala e opacità.
- **Responsiveness**: Allineata al breakpoint di 768px per coerenza con l'header.

---

### `Header` — `src/components/layout/Header.tsx`
**Scopo**: Navigazione principale dell'applicazione (Sfera, Redazione, Cinema).
**Comportamento**: 
- **Sticky / Collapsible**: Si riduce di dimensione durante lo scroll.
- **Scroll Spy**: Utilizza `IntersectionObserver` per evidenziare la sezione attiva.
- **Bubble Effect**: Un indicatore circolare (orb/bubble) insegue l'icona attiva.
- **Visibilità**: L'header è nascosto automaticamente in tutte le rotte che iniziano con `/admin` (Dashboard Redazione).

| Sezione | ID | Icona | Ruolo |
| :--- | :--- | :--- | :--- |
| Sfera | `sfera` | Home | Vai al grafo 3D principale. |
| Redazione | `redazione` | Newspaper | Sezione con contenuti editoriali. |
| Cinema | `cinema` | Clapperboard | Navigazione film per sala/news. |

**Dipendenze**: `lucide-react`, `animejs` (per lo scroll fluido), `createClient` (Supabase).

---

### `AuthHandler` — `src/components/auth/AuthHandler.tsx`
**Scopo**: Gestore invisibile lato client per la logica di autenticazione.
**Responsabilità**:
- Intercettare i parametri URL di Supabase (es. `#access_token`).
- Gestire i redirect post-login.
- Pulire l'URL dai token dopo l'accettazione.

---

## Componenti UI Base (Shadcn)
Questi componenti si trovano in `src/components/ui/` e seguono le specifiche di Radix UI:

- **Button**: Pulsanti con varianti `ghost`, `outline`, `link`.
- **Input / Label**: Utilizzati nei form di login e recovery.
- **SplashScreen**: Animazione di caricamento con il logo pulsante di NoZapp. Triggata ad ogni caricamento della rotta `/sphere`.

---
> [!NOTE]
> Tutti i componenti utilizzano tipicamente `framer-motion` per micro-interazioni e transizioni di stato.

🔄 **Aggiornato il 2026-03-26**: Documentati i fix di ShellNavigator, ProfileModal e la visibilità condizionale dell'Header.
