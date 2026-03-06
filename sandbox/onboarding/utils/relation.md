# Onboarding — Specifica Dettagliata
**La Sfera Semantica** · Documento di prodotto

---

## Indice

1. [Obiettivo](#obiettivo)
2. [Principi di design](#principi-di-design)
3. [Flusso completo](#flusso-completo)
4. [Fase 1 — Welcome](#fase-1--welcome)
5. [Fase 2 — Valutazione film](#fase-2--valutazione-film)
6. [Fase 3 — Riepilogo piramidale](#fase-3--riepilogo-piramidale)
7. [Fase 4 — Conferma finale](#fase-4--conferma-finale)
8. [Meccaniche di interazione](#meccaniche-di-interazione)
9. [Dati raccolti](#dati-raccolti)
10. [Predisposizioni future](#predisposizioni-future)
11. [Identità visiva](#identità-visiva)

---

## Obiettivo

L'onboarding ha un unico scopo: **estrarre un profilo stilistico e culturale dall'utente** attraverso la reazione a film-sonda selezionati editorialmente, senza che l'utente percepisca di essere catalogato.

Il risultato dell'onboarding è un insieme ordinato di **pilastri del gusto** — film che l'utente ha dichiarato di amare — che diventano i nodi di partenza per l'algoritmo di traversal del grafo editoriale.

Il tono è deliberatamente editoriale, non algoritmico. L'utente non "compila un profilo": *sceglie le sue porte*.

---

## Principi di Design

**Linguaggio esperienziale, non tassonomico.**
Non si mostrano mai generi, etichette come "autoriale" o "minimalista", né sistemi di rating. Solo film, mood, reazioni.

**Nessuna sensazione di quiz.**
Il form non è un multi-select. Guida l'utente attraverso gruppi curati, con un ritmo preciso.

**Trasparenza e agency.**
Alla fine l'utente vede esattamente cosa il sistema ha capito di lui, può riordinare e correggere. Non viene catalogato da un algoritmo opaco: sceglie consapevolmente.

**Mobile-first, responsive.**
Tutto il flusso funziona su schermo mobile con swipe gesture. Su desktop si aggiunge navigazione con frecce e hover states.

---

## Flusso Completo

```
Welcome
  └── Gruppo 1 (5 film, uno alla volta)
        └── Completion card gruppo 1
              └── Gruppo 2 (5 film, uno alla volta)
                    └── Completion card gruppo 2
                          └── Gruppo 3 (5 film, uno alla volta)
                                └── Completion card gruppo 3
                                      └── Riepilogo piramidale
                                            └── Conferma → Sfera Semantica
```

---

## Fase 1 — Welcome

**Route:** `/onboarding` (primo accesso)

Una singola schermata, nessuna azione richiesta tranne il CTA iniziale.

### Contenuto
- **Eyebrow:** `Semantic Sphere · Onboarding` (monospace uppercase)
- **Titolo:** "I tuoi *pilastri* del gusto" — serif, peso 300, il termine in corsivo è in oro
- **Divisore:** linea orizzontale in oro, 32px di larghezza
- **Sottotitolo:** "Ogni film che ami è una porta. Mostraci le tue porte."
- **Descrizione:** testo monospace che spiega brevemente il meccanismo (3 gruppi, 3 reazioni possibili)
- **CTA:** "Inizia →"

### Comportamento
- Tutti gli elementi entrano con animazione `fadeUp` in sequenza (stagger 80ms)
- Click su CTA → fade out pagina → fade in Fase 2

---

## Fase 2 — Valutazione Film

**Struttura:** 3 gruppi da 5 film ciascuno, per un totale di **15 film-sonda**.

La selezione dei film-sonda è responsabilità editoriale della redazione. I film devono essere scelti per massimizzare la discriminazione del gusto, coprendo assi come: narrativo/visivo, emotivo/intellettuale, lento/adrenalinico, autoriale/popolare, occidentale/internazionale. I gruppi sono ordinati per riconoscibilità decrescente: il primo gruppo contiene film molto noti, il terzo film più di nicchia.

### Struttura dello schermo

**Topbar** (fissa)
- Brand: "La *Sfera* Semantica"
- Indicatore gruppo: 3 dot + label "Gruppo N/3"

**Barra di progresso** (2px, oro su crema scuro)
- Avanza proporzionalmente a quanti film del gruppo corrente sono stati visti

**Stage centrale**
- Headline contestuale (diversa per ogni gruppo)
- Card film
- Frecce di navigazione + dot trail
- Bottoni di reazione

**Bottom bar** (fissa)
- Sinistra: contatore film amati nel gruppo corrente
- Destra: nudge testuale + bottone "Prossimo gruppo →"

---

### La Card Film

Ogni film è rappresentato da una card verticale (aspect ratio 2:3) con:

- **Sfondo:** gradiente generato dai colori cromatici associati al film (nessuna immagine esterna)
- **Mood:** testo monospace in alto, opacità bassa — descrive le emozioni del film in 3-4 parole
- **Titolo:** serif, bianco, in basso a sinistra
- **Regista + anno:** monospace, opacità 45%, sotto il titolo

La card è l'unico elemento visivo del film. Non ci sono poster, locandine, o immagini reali in questa fase — solo colore e tipografia. Questo scelta è deliberata: evita che la valutazione sia influenzata dalla familiarità grafica con la locandina.

> **Nota implementativa:** In produzione i colori del gradiente saranno estratti automaticamente dal poster reale tramite color sampling, o definiti manualmente dalla redazione per ciascun film-sonda.

---

### Navigazione tra Film

**Avanzamento automatico:** dopo ogni reazione, la card esce con animazione direzionale e appare il film successivo.

**Frecce ← →:** permettono di tornare su film già valutati per cambiare idea. La freccia sinistra è disabilitata sul primo film, la destra sull'ultimo.

**Dot trail:** 5 punti cliccabili, uno per film. Il colore comunica lo stato:
- Oro pieno → amato
- Grigio scuro → non fa per me
- Bordo grigio (vuoto) → non visto
- Oro più grande → film corrente

**Swipe (mobile):** scorrere a destra equivale a "L'ho amato", a sinistra a "Non fa per me". I bottoni rimangono disponibili per "Non l'ho visto" e per correggere la direzione.

---

### Le Tre Reazioni

| Reazione | Simbolo | Significato per il sistema |
|---|---|---|
| **L'ho amato** | ♥ | Candidato diretto a diventare pilastro |
| **Non fa per me** | ✕ | Segnale negativo, esclude certi percorsi del grafo in futuro |
| **Non l'ho visto** | ○ | Assenza di segnale — non influenza il profilo |

La distinzione tra "Non fa per me" e "Non l'ho visto" è cruciale: l'ignoranza di un film è un dato diverso dal rifiuto estetico, e va trattato come tale.

---

### Completion Card

Quando l'utente valuta l'ultimo film del gruppo, la card del film esce con la sua animazione normale. Al suo posto appare una **completion card** — stesso sizer, stessa posizione — con:

- Sfondo crema semi-trasparente con bordo sottile
- Spunta ✓ oro con animazione di pop (bounce)
- Label "tutti i film valutati" in monospace
- Barra di progresso al 100%

In questo stato:
- I dot rimangono cliccabili per tornare a qualsiasi film e cambiare idea
- Il bottone "Prossimo gruppo →" nella bottom bar si attiva
- I bottoni di reazione scompaiono

Il click sul bottone avanza al gruppo successivo con transizione fade.

---

### Vincolo di Avanzamento

L'utente può passare al gruppo successivo **solo dopo aver espresso una reazione su tutti e 5 i film** del gruppo corrente. Non esiste un numero minimo di "amati" richiesto: anche 0 cuori è un profilo valido (il sistema capirà che quel cluster stilistico non appartiene all'utente).

Se l'utente non ha ancora valutato tutti i film, nella bottom bar appare il nudge: *"valuta tutti i film per continuare"*.

---

### Headline per Gruppo

Ogni gruppo ha un'headline diversa nello stage, che guida il tono della valutazione:

- **Gruppo 1:** "Questo film *ti appartiene?*"
- **Gruppo 2:** "Ti *riconosce?*"
- **Gruppo 3:** "*Sii onesto.*"

La progressione è intenzionale: si parte da una domanda aperta, si stringe su qualcosa di più intimo, si chiude con un invito alla sincerità.

---

## Fase 3 — Riepilogo Piramidale

Dopo il terzo gruppo, l'utente accede al riepilogo. Il sistema prende tutti i film marcati come "L'ho amato" (in tutti e tre i gruppi, fino a un massimo di 5) e li dispone in una **struttura piramidale**.

### Struttura della Piramide

```
         [  Vertice  ]          ← 1 film, card più grande
       [ Film 2 | Film 3 ]      ← 2 film, card medie
     [ Film 4     | Film 5 ]    ← fino a 2 film, card piccole
```

Ogni livello ha card di dimensione proporzionalmente decrescente, comunicando visivamente la gerarchia di importanza.

Il **vertice** è il pilastro centrale — il film che più di tutti definisce il profilo dell'utente. È il nodo di partenza primario per l'algoritmo di traversal.

### Label per livello

| Posizione | Label |
|---|---|
| 0 (vertice) | `▲ vertice` |
| 1, 2 | `n° 2`, `n° 3` |
| 3, 4 | `n° 4`, `n° 5` |

### Interazioni

**Drag & drop per riordinare:** l'utente trascina le card per cambiare la gerarchia. Il film al vertice è quello che conta di più nello scoring del grafo. La card di destinazione scala leggermente per segnalare l'atterraggio, quella trascinata si opacizza.

**Sostituzione:** passando il cursore su una card (o tap su mobile), appare il bottone "↔ Sostituisci". Il click apre un overlay con tutti i film amati non ancora presenti nella piramide, selezionabili come sostituti.

**Stato vuoto:** se l'utente non ha amato nessun film nei tre gruppi, compare uno stato vuoto con un invito a tornare indietro e rivalutare. Il sistema non impone un minimo, ma segnala che senza pilastri la Sfera non può funzionare.

---

## Fase 4 — Conferma Finale

Dopo il riepilogo, un click su "Entra nella Sfera →" porta alla schermata finale.

### Contenuto
- Eyebrow: "Onboarding completato"
- Titolo: "La tua *Sfera* è pronta"
- Corpo: spiegazione che i pilastri sono stati registrati e il grafo è pronto
- Anteprima orizzontale delle card-pilastro (versione thumbnail)
- CTA: "Entra nella Sfera →" → redirect a `/sphere`

A questo punto il sistema:
1. Scrive i `user_pillars` su Supabase con il rank corrispondente alla posizione nella piramide
2. Imposta `onboarding_complete = true` sul profilo utente
3. Il middleware sblocca l'accesso a tutte le route dell'app

---

## Meccaniche di Interazione

### Animazioni Card

| Trigger | Animazione |
|---|---|
| Reazione "L'ho amato" | Esce a destra con rotazione +8° |
| Reazione "Non fa per me" | Esce a sinistra con rotazione -8° |
| Reazione "Non l'ho visto" | Sale verso l'alto, scala a 0.96 |
| Navigazione → (freccia avanti) | Scivola a sinistra |
| Navigazione ← (freccia indietro) | Scivola a destra |
| Entrata nuova card | Appare dal basso con fade |

Le animazioni di navigazione sono volutamente più sottili di quelle di valutazione, per comunicare la differenza tra "sto decidendo" e "sto navigando".

### Transizioni di Fase

Il passaggio tra gruppi e tra fasi usa un fade globale sulla root (opacity 0 → funzione → opacity 1), con durata 280ms. Abbastanza veloce da non sembrare lento, abbastanza lento da non sembrare brusco.

---

## Dati Raccolti

Al termine dell'onboarding il sistema dispone di:

```ts
interface UserPillar {
  filmId: string;   // ID del film nel database
  rank: number;     // 1 = vertice, 2-5 = livelli successivi
}

// Reazioni negative (per uso futuro)
interface UserReaction {
  filmId: string;
  reaction: 'disliked' | 'unseen';
}
```

I `user_pillars` vengono scritti in ordine di rank. Le reazioni negative sono disponibili nel client durante l'onboarding ma non vengono persistite nella versione attuale — sono predisposte per un futuro sistema di esclusione dei percorsi del grafo.

---

## Predisposizioni Future

Lo schema dati e l'architettura dell'onboarding sono predisposti per accogliere in futuro:

**Dati demografici opzionali** (età e sesso)
- Colonne nullable `age_range` e `gender` già presenti nella tabella `users`
- Tipo `UserProfile` include i campi come opzionali (`?`)
- La funzione `scoreNode()` in `scoring.ts` ha il parametro `ScoringContext` predisposto per riceverli, con un TODO esplicito e localizzato
- Quando attivati: aggiungere i campi al form di onboarding e la logica dentro `scoreNode()` — nessun'altra modifica all'architettura

**Selezione adattiva dei film-sonda**
- Se l'utente marca "Non l'ho visto" su più di N film in un gruppo, il sistema può caricare film alternativi più noti
- La struttura a gruppi separati facilita questo tipo di sostituzione senza interrompere il flusso

---

## Identità Visiva

L'onboarding eredita l'identità visiva del progetto senza eccezioni.

| Elemento | Valore |
|---|---|
| Sfondo | `#F2EDE3` (crema caldo) |
| Inchiostro | `#1A1614` |
| Inchiostro leggero | `#4A4440` |
| Inchiostro sfumato | `#9A9490` |
| Oro | `#B8895A` |
| Oro chiaro | `#D4A870` |
| Font titoli | Cormorant Garamond (serif, peso 300) |
| Font UI | Courier Prime (monospace) |
| Corsivo | usato esclusivamente per termini-chiave in oro |
| Uppercase | esclusivamente per label monospace, tracking 0.2em |

Il tono visivo è **chiaro, caldo, editoriale**. Nessun elemento scuro, nessun componente "tecnico" visibile. L'interfaccia deve sembrare una mostra, non un form.