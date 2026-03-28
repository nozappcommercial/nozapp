updated: 2026-03-26
agent: aggiornatore
---

# Componenti UI

[← Torna all'indice](./progetto.md)

## Panoramica
I componenti di NoZapp sono suddivisi in **UI atomici** (Shadcn), **Layout** (struttura fissa) e **Functional** (logica specifica). Questa sezione documenta i componenti principali non legati direttamente a Three.js.

## Componenti Specifici

### `ShellNavigator` — `src/components/sphere/ShellNavigator.tsx`
**Scopo**: Gestisce la navigazione tra i livelli di shell della sfera.
**Responsabilità**: Visualizzare il livello corrente, gestire l'hover e triggerare il cambio di shell.

---

### `MovieDetailPanel` — `src/components/sphere/MovieDetailPanel.tsx`
**Scopo**: Visualizza i dettagli completi del film selezionato (Poster, Titolo, Meta, Feedbacks).
**Caratteristiche**:
- **Swipe UX**: Include logica di swipe orizzontale per navigare tra i film adiacenti.
- **Micro-interazioni**: Animazione di entrata/uscita fluida gestita tramite classi CSS dinamiche.

---

### `SphereUIOverlays` — `src/components/sphere/SphereUIOverlays.tsx`
**Scopo**: Contiene tutti gli elementi UI bidimensionali sovrapposti alla sfera 3D.
**Responsabilità**:
- Renderizza l'Header specifico della sfera (`SphereHeader`).
- Visualizza i Breadcrumb di navigazione tra le shell.
- Fornisce i pulsanti di controllo direzionale (Nav Buttons).

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
- **Sezione Dati Personali**: Aggiunta sezione per visualizzare e modificare età, stato (paese) e sesso con persistenza automatica.
- **Centratura**: Implementata tramite flex-container dedicato per evitare conflitti tra CSS `transform` e animazioni Framer Motion.
- **Responsiveness**: Allineata al breakpoint di 768px per coerenza con l'header.

---

### `Header` — `src/components/layout/Header.tsx`
**Scopo**: Navigazione principale dell'applicazione (Sfera, Redazione, Cinema).
**Comportamento**: 
- **Sticky / Collapsible**: Si riduce di dimensione durante lo scroll.
- **Utility Centralizzate**: Utilizza l'hook globale `useIsMobile` e le utility `scroll-utils` per una gestione pulita delle interazioni.
- **Bubble Effect**: Un indicatore circolare (orb/bubble) insegue l'icona attiva.
- **Visibilità**: L'header è nascosto automaticamente in tutte le rotte che iniziano con `/admin` (Dashboard Redazione) o quando un film è selezionato nella sfera.

| Sezione | ID | Icona | Ruolo |
| :--- | :--- | :--- | :--- |
| Sfera | `sfera` | Home | Vai al grafo 3D principale. |
| Redazione | `redazione` | Newspaper | Sezione con contenuti editoriali. |
| Cinema | `cinema` | Clapperboard | Navigazione film per sala/news. |

**Dipendenze**: `lucide-react`, `animejs` (per lo scroll fluido), `createClient` (Supabase).

---

### `AdminHeader` — `src/components/admin/AdminHeader.tsx`
**Scopo**: Header dinamico per l'area amministrativa.
**Responsabilità**:
- Mostrare il titolo contestuale (Dashboard, Redazione, Utenti, Analisi, Verifica).
- Fornire il link di ritorno alla Dashboard nelle sottopagine.
- Gestire il logout globale dell'area admin.
- **Ottimizzazione Mobile**: Aggiunto padding per il notch (`safe-area-inset-top`) e trasformati i pulsanti in icone circolari per massimizzare lo spazio su schermi piccoli.
**Comportamento**: Utilizza `usePathname` per determinare lo stato della navigazione in tempo reale.

---

### `PlatformStatus` — `src/components/admin/PlatformStatus.tsx`
**Scopo**: Dashboard di monitoraggio tecnico ribattezzata "System Vitals".
**Caratteristiche**:
- **Estetica Premium**: Design in stile Vercel con indicatori LED di build success e metriche di latenza reale.
- **Responsiveness**: Implementato effetto accordion su mobile per ridurre l'ingombro verticale.
- **Real-time Data**: Visualizza trend di engagement e totali utenti in tempo reale.

---

### `CinemaForm` — `src/components/admin/CinemaForm.tsx`
**Scopo**: Form per la gestione manuale dei film nel carosello "Ora al Cinema".
**Responsabilità**:
- Validazione dei dati tramite Zod.
- Gestione dell'integrità dei temi (conversione stringa -> array).
- Calcolo e visualizzazione della preview del poster.
- Gestione della data di scadenza (`expires_at`).
**Integrazione**: Utilizza le Server Actions in `src/app/actions/cinema.ts`.

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

🔄 **Aggiornato il 2026-03-28**: Ottimizzazione mobile dell'AdminHeader e evoluzione del modulo PlatformStatus in "System Vitals". Estensione del ProfileModal con i nuovi campi demografici.
File modificati: `src/components/admin/AdminHeader.tsx`, `src/components/admin/PlatformStatus.tsx`, `src/components/profile/ProfileModal.tsx`

---
🔄 **Aggiornato il 2026-03-27**: Decomposizione dei componenti della Sfera (`MovieDetailPanel`, `SphereUIOverlays`) e integrazione utility globali nell'Header.
File modificati: `src/components/sphere/MovieDetailPanel.tsx`, `src/components/sphere/SphereUIOverlays.tsx`, `src/components/layout/Header.tsx`, `src/components/admin/AdminHeader.tsx`
