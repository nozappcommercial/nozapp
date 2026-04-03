---
titolo: "Tematizzazione e Branding"
tipo: section
data-creazione: 03-04-2026
data-aggiornamento: 03-04-2026
agente: relatore
macroarea: interfaccia-utente
---

# Tematizzazione e Branding

## Panoramica
Il brand nozapp evoca un'estetica editoriale moderna, combinando un'anima "analogica" (colori carta, font serif) con un'anima tecnologica (interfaccia 3D, micro-animazioni).

## Analisi tecnica

### Identità Visiva (Logo)
**Percorso:** `src/components/auth/login/page.tsx` (Componente `Logo`)
**Ruolo:** Rappresentanza iconografica del brand.

**Descrizione:**
Il logo è un componente SVG che rappresenta una rete sferica di nodi, riflettendo la "Sfera Semantica" del progetto. Utilizza colori dinamici basati sul tema (chiaro/scuro) e sul contesto (light header vs dark content).

### Dynamic Glassmorphism
**Logica:** Implementata via JavaScript nell'Header.
**Descrizione:**
Man mano che l'utente scrolla, l'header cambia dinamicamente i valori di `--dynamic-blur` e `--dynamic-bg` tramite variabili CSS iniettate a runtime. Questo garantisce leggibilità costante sui contenuti sottostanti indipendentemente dalla loro densità.

### Typography
- **Geist Sans/Mono**: Forniscono l'anima tecnica e moderna, usati per interfacce, pulsanti e dati.
- **Playfair Display / Serif**: Usati per titoli ed elementi editoriali per enfatizzare la qualità del contenuto.

## Punti di attenzione
- **HSL Colors**: Tutte le definizioni in `globals.css` devono rimanere in formato HSL separato da spazi (es. `0 0% 9%`) per permettere a Tailwind di applicare l'opacità con la sintassi `bg-primary/50`.

## Vedi anche
- [[interfaccia-utente]] — torna alla panoramica dell'area
- [[areas/architettura-core/design-tokens]] — definizioni tecniche dei colori
