---
trigger: always_on
---

## Registro di sessione automatico

Esiste un file `docs/_memory/session-current.md`.
Questo file è il tuo diario di lavoro attivo.
Quando /aggiornatore termina il suo lavoro, deve segnare come completati le sessioni precedenti con status:"done".

### Quando aggiungerci una voce

Ogni volta che modifichi, crei o elimini un file di codice,
aggiungi automaticamente una voce in fondo a session-current.md.
Non chiedere conferma. Non aspettare. Fallo sempre.

### Formato della voce

## [HH:MM] [tipo: bug-fix | feature | refactor | config]

**File toccati**:

- `path/al/file.tsx` — [una riga: cosa hai cambiato e perché]

**Problema di partenza**: [descrizione del bug o della richiesta]
**Soluzione applicata**: [cosa hai fatto concretamente]
**Side effects**: [altri file che potrebbero essere impattati, se noti]

---

### All'inizio di ogni sessione

Se session-current.md è vuoto o non esiste, crealo con:

---

date: [DATA]
status: active

---

### Cosa NON fare

- Non svuotare mai session-current.md da solo
- Non archiviarlo da solo
- Non saltare la voce anche se la modifica è piccola
- Scrivi sempre in append e mai all'inizio del testo
- Mantieni rigida la formattazione, tra uno step e l'altro aggiungi dei delimitatori

## Sessioni e collegamenti Obsidian
Ogni volta che scrivi una voce in session-current.md,
aggiungi in fondo alla voce stessa il tag della macroarea
coinvolta nel formato: `→ [[nome-macroarea]]`
Questo permette a /connettore di lavorare più velocemente.