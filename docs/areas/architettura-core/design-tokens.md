---
titolo: "Design Tokens"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: architettura-core
---

# Design Tokens

## Panoramica
Il sistema visivo di nozapp è basato su una palette cromatica neutra e "premium" che vira verso toni caldi. L'implementazione utilizza Tailwind CSS con variabili CSS per supportare temi (light/dark) e coerenza visiva.

## Analisi tecnica

### Layer Base e Utilities
**Percorso:** `src/app/globals.css`
**Ruolo:** Punto centrale di definizione degli stili CSS.

**Descrizione:**
Definisce i design tokens tramite variabili CSS all'interno del layer `@layer base`. I colori sono definiti in formato HSL per permettere una manipolazione fluida dell'opacità tramite Tailwind.

### Colori Chiave (CSS Variables)
- **Background Primario**: `#faf7f2` (impostato direttamente nel body).
- **Secondary/Muted**: Utilizzati per componenti di sfondo e testi meno rilevanti.
- **Accent/Primary**: Toni scuri (`hsl(0 0% 9%)`) per contrasto elevato su testi e pulsanti primari.

### Tipografia
Le pile di font sono configurate per puntare ai font locali caricati nel layout:
- `--font-serif`: Mappa Geist Sans (usato come font principale).
- `--font-mono`: Mappa Geist Mono (usato per dati tecnici e interfacce specifiche).

## Punti di attenzione
- **Radius**: Il raggio degli angoli è standardizzato a `0.5rem` (`--radius`).
- **Dark Mode**: È presente una configurazione completa (`.dark`) che inverte i valori di luminosità per garantire leggibilità in modalità scura, mantenendo la coerenza del design.

## Vedi anche
- [[architettura-core]] — torna alla panoramica dell'area
- [[areas/interfaccia-utente/interfaccia-utente]] — utilizzo dei tokens nei componenti
