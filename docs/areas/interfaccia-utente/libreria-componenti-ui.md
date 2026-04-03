---
titolo: "Libreria Componenti UI"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: interfaccia-utente
---

# Libreria Componenti UI

## Panoramica
La UI di nozapp è costruita su una base solida di componenti atomici altamente accessibili e personalizzabili, ispirati al pattern Shadcn UI e basati su Radix UI. La coerenza visiva è garantita dall'uso rigoroso dei design tokens.

## Analisi tecnica

### Componenti Core (Atomic UI)
**Percorso:** `src/components/ui/`
**Ruolo:** Mattoncini fondamentali dell'interfaccia.

**Descrizione:**
I componenti utilizzano `class-variance-authority` (CVA) per gestire le varianti (es. button primary vs outline) e `tailwind-merge` per la composizione delle classi.
- **Button**: Supporta varianti `default`, `destructive`, `outline`, `secondary`, `ghost` e `link`.
- **Form/Input**: Integrati con `react-hook-form` e `zod` per una validazione robusta e accessibilità ARIA integrata.
- **Tabs**: Utilizzati ampiamente (es. nella pagina di login) per separare i contesti senza cambiare rotta.

### Componenti Strutturali (Layout)
**Percorso:** `src/components/layout/`
**Ruolo:** Gestione dello spazio e della navigazione globale.

**Descrizione:**
- **Header**: Un componente complesso che supporta layout orizzontale (mobile/top) e verticale (desktop/sidebar). Include un sistema di "Scroll Spy" tramite `IntersectionObserver` per evidenziare la sezione attiva.
- **AppLoader**: Gestisce lo stato visivo di caricamento iniziale, essenziale per la percezione di performance in un'app ricca di asset 3D.

## Punti di attenzione
- **Accessibilità**: Molti componenti (Tabs, Form) delegano la gestione del focus e dei ruoli ARIA a Radix UI, garantendo il supporto agli screen reader.
- **Riuso**: Evitare di creare nuovi stili ad-hoc; preferire sempre l'estensione dei componenti esistenti in `src/components/ui/`.

## Vedi anche
- [[interfaccia-utente]] — torna alla panoramica dell'area
- [[standard-animazioni]] — come i componenti si muovono
