---
date: 2026-03-29
status: active
---
## 14:24 [tipo: feature | bug-fix | refactor | UI/UX]

**File toccati**:

- `src/app/auth/confirm/page.tsx` — Nuova pagina di successo della conferma mail con feedback visivo dedicato.
- `src/components/auth/AuthHandler.tsx` — Cattura automatica del parametro 'code' per reindirizzare dai link mail alla pagina di successo.
- `src/components/onboarding/OnboardingFlow.tsx` — Unificazione font, safe-area padding per il notch, fix icona "X" e riprogettazione pannello piramide laterale.

**Problema di partenza**: L'utente veniva confermato ma finiva in una home vuota con URL sporco; l'onboarding presentava tagli visivi e problemi di allineamento su mobile.
**Soluzione applicata**: Creata una rotta di conferma esplicita, corretti i padding per la safe-area e riprogettato l'elemento piramide per adattarsi a schermi piccoli trasformando il drawer in side-panel.
**Side effects**: Nessuno, le modifiche ai font sono variabili CSS controllate.


## 16:40 [tipo: UI/UX]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Ridotto ingombro verticale (card 30vh, bottoni 74px) e spaziature per fit ottimale su mobile.

**Problema di partenza**: Gli elementi dell'onboarding riempivano eccessivamente lo schermo verticale su mobile, rendendo l'interfaccia troppo serrata e rischiando di nascondere elementi del footer.
**Soluzione applicata**: Ottimizzati i parametri `clamp` per altezze e gap, riducendo le dimensioni di card e componenti.
**Side effects**: Nessuno visibile su desktop grazie all'uso di clamp.

---

## 16:45 [tipo: bug-fix | UI/UX]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Forzato layout `height: 100vh` per le sezioni, rimosse definizioni CSS duplicate e pulita la struttura del footer.

**Problema di partenza**: Al termine della valutazione di un gruppo, il pulsante "Prossimo Gruppo" non era visibile o accessibile, bloccando l'avanzamento dell'utente.
**Soluzione applicata**: Stabilizzato il layout grid a 100vh fissi per garantire che il footer rimanga sempre all'interno del viewport e ridimensionata la card di completamento.
**Side effects**: Risolto il blocco funzionale nell'onboarding.


## 16:55 [tipo: bug-fix | UI/UX]

**File toccati**:

- `src/components/onboarding/OnboardingFlow.tsx` — Adottato `100dvh`, rimosso padding globale da `.ob-root` e inseriti padding Safe Area mirati.

**Problema di partenza**: Il footer risultava tagliato su mobile. La causa era il padding globale in `ob-root` che sommato ai 100vh spingeva i componenti fuori dall'overflow.
**Soluzione applicata**: Gestione granulare della Safe Area per componente e uso di `100dvh` per compatibilità con le barre dinamiche dei browser.
**Side effects**: Risolto definitivamente il problema di visibilità del footer su mobile.

---
