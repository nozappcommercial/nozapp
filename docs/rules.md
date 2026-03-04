# Rules — Regole di Business & Vincoli

> Questo file definisce le regole di dominio, i vincoli di business e i comportamenti attesi del sistema.
> Un agente NON deve mai violare queste regole, anche se tecnicamente possibile.

---

## 1. Editorial Graph — Regole del Grafo

### 1.1 Creazione degli archi
- Gli archi (`editorial_edges`) sono **curati dalla redazione** e non generati algoritmicamente.
- Un agente non deve mai creare, modificare o eliminare archi in modo automatico.
- I tipi di arco ammessi sono esattamente tre: `thematic`, `stylistic`, `contrast`.
- Un arco è **orientato** (`from_film_id → to_film_id`) ma ai fini dell'UX viene trattato come bidirezionale nella navigazione.

### 1.2 Peso degli archi
- Il campo `weight` (0.0–1.0) rappresenta la forza della connessione editoriale.
- Valori < 0.2 sono considerati connessioni deboli e possono essere escluse dalle raccomandazioni primarie.
- Il peso non deve essere modificato dall'utente.

### 1.3 Integrità del grafo
- Non sono ammessi self-loop (un film non può connettersi a se stesso).
- Non sono ammessi archi duplicati (stessa coppia `from/to` con stesso `type`).

---

## 2. Pilastri del Gusto — Regole Utente

### 2.1 Onboarding
- Ogni utente **deve** completare il form psicografico prima di accedere alla Sfera Semantica.
- L'onboarding è bloccante: nessuna route dell'app è accessibile finché `onboarding_complete = false`.

### 2.2 Numero di pilastri
- L'utente deve selezionare **da 3 a 5 pilastri** (film di riferimento).
- Meno di 3 pilastri rendono l'algoritmo di traversal non significativo.
- Più di 5 pilastri diluiscono eccessivamente il profilo.

### 2.3 Modifica dei pilastri
- L'utente può modificare i propri pilastri in qualsiasi momento dal profilo.
- La modifica invalida e ricalcola tutte le raccomandazioni esistenti.
- Non si conserva la cache delle raccomandazioni precedenti dopo una modifica.

---

## 3. Algoritmo di Raccomandazione — Vincoli

### 3.1 Cosa l'algoritmo NON fa
- **Non filtra** per genere, anno, durata o altri metadati classici.
- **Non usa** sistemi di rating/voto degli utenti (no collaborative filtering).
- **Non mostra** film già presenti tra i pilastri dell'utente come raccomandazioni.

### 3.2 Cosa l'algoritmo FA
- Naviga il grafo editoriale partendo dai nodi-pilastro.
- Suggerisce percorsi con un filo logico editoriale esplicito (il `label` dell'arco).
- Garantisce sempre la tracciabilità del percorso: ogni raccomandazione mostra da quale pilastro proviene e attraverso quale tipo di connessione.

### 3.3 Profondità massima
- La navigazione si ferma a **depth 2** (Shell II) per le raccomandazioni principali.
- Nodi a depth 3+ possono essere mostrati come "scoperte avanzate" ma non nella vista principale.

---

## 4. Accesso ai Dati — RLS (Row Level Security)

- **Ogni tabella** in Supabase deve avere RLS abilitato. Nessuna eccezione.
- Un utente può leggere i propri `user_pillars` e nessun altro.
- I dati del grafo (`films`, `editorial_edges`) sono pubblici in lettura per tutti gli utenti autenticati.
- Nessun utente può scrivere direttamente su `films` o `editorial_edges` (solo ruolo `service_role`).

---

## 5. UX — Regole di Interfaccia

### 5.1 Sfera Semantica
- La Sfera deve essere **sempre interattiva**: rotazione, zoom, hover sono disponibili in ogni stato.
- La rotazione automatica si **interrompe** solo quando l'utente seleziona (click) un nodo, non sull'hover.
- Al click su un nodo, si mostrano **solo** i titoli dei film connessi al path selezionato.
- Deselezionando un nodo, la sfera riprende la rotazione automatica.

### 5.2 Trasparenza editoriale
- Ogni raccomandazione deve mostrare il **motivo editoriale** (il `label` dell'arco).
- Non mostrare mai una raccomandazione senza il suo path di provenienza.

### 5.3 Onboarding Form
- Il form psicografico non è un semplice multi-select di film.
- Deve guidare l'utente attraverso **domande qualitative** (temi, stati d'animo, registi) prima di proporre i film-pilastro.
- L'interfaccia deve essere raffinata e non trasmettere la sensazione di un "quiz".
