---
title: "Onboarding UI Refactoring"
date: 2026-03-30
time: 15:09
id: 0bad1642-ca91-47c1-ba5b-6eda1bb8b6d8
tags: [#onboarding, #ui-ux, #refactoring, #status/done]
---

# Sessione 15:09 — Rifinitura Architettura Onboarding

## Obiettivo della sessione
Overhaul completo del flusso di onboarding di NoZapp per migliorare l'usabilità mobile e la coerenza visiva.

## Interventi principali
1. **Layout & Tipografia**: Fix di problemi di layout (barre bianche) e standardizzazione della tipografia usando *Cormorant Garamond* (anche se successivamente si è passati a Geist).
2. **Refactoring Reazioni**: Unificazione dei pulsanti "visto/non visto" basandosi sul riferimento `beta1.jsx`.
3. **Ottimizzazione Mobile**: Ridimensionamento del pulsante "Prossimo Gruppo" per una migliore ergonomia su dispositivi touch.
4. **Architettura a Step Verticali**: Implementazione di un sistema a scorrimento verticale (step-based) che sostituisce i pannelli laterali/bottom-sheet. La piramide dei pilastri e la gallery dei film sono ora accessibili tramite scrolling fluido.

## Esito
Struttura più solida e navigazione semplificata su schermi piccoli.
