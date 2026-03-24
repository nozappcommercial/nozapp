# Componenti UI

NoZapp utilizza un mix di componenti custom e librerie di utility per creare un'interfaccia moderna e reattiva.

## Componenti Principali

### `Header.tsx`
*   **Percorso**: `src/components/layout/Header.tsx`
*   **Scopo**: Header flottante a forma di pillola che gestisce la navigazione principale e le azioni utente (profilo, logout).
*   **Caratteristiche**:
    *   **Scroll Spy**: Cambia guscio attivo in base alla sezione visibile nella Home.
    *   **Glassmorphism**: Effetto sfocato dinamico basato sullo scroll.
    *   **Layout**: Supporta layout orizzontale (default) e verticale (sperimentale).
*   **Props**: Nessuna (gestisce lo stato internamente tramite hooks).

### `SplashScreen.tsx`
*   **Percorso**: `src/components/ui/SplashScreen.tsx`
*   **Scopo**: Gestisce il caricamento iniziale dell'applicazione fornendo un feedback visivo immediato all'utente.
*   **Animazione**: Spesso integrato con Framer Motion o CSS animations.

## ShellNavigator
*   **Percorso**: `src/components/sphere/ShellNavigator.tsx`
*   **Scopo**: Pannello di controllo flottante che appare quando un film è selezionato nella Sfera Semantica.
*   **Interazioni**:
    *   Navigazione tra filtri (Parent, Siblings, Children).
    *   Visualizzazione del percorso (Breadcrumb).
    *   Controllo della profondità del grafo.

## Tabelle delle Props (Esempio)

| Componente | Prop | Tipo | Default | Descrizione |
| :--- | :--- | :--- | :--- | :--- |
| `Header` | - | - | - | Gestito internamente |
| `ShellNavigator` | `active` | `boolean` | `false` | Se il navigatore è visibile |

## Dipendenze UI
*   **Lucide React**: Per le icone di sistema.
*   **Framer Motion**: Per le transizioni di stato e animazioni micro-UI.
*   **Anime.js**: Utilizzato per gestire scroll fluidi e animazioni complesse coordinate.
*   **Tailwind CSS**: Per tutto lo styling atomico e il responsive design.

---
[← Torna all'indice](./index.md)
