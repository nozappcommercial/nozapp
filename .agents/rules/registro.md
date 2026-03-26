---
trigger: always_on
---

## Registro di sessione automatico

Esiste un file `docs/_memory/session-current.md`.
Questo file è il tuo diario di lavoro attivo.

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