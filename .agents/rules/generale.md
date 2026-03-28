---
trigger: always_on
---

# Sistema di Documentazione — Regole Globali

## Workspace

Il progetto si trova in: /Volumes/Crucial/workspace/web/nozapp
La cartella della documentazione è: /Volumes/Crucial/workspace/web/nozapp/docs/

## File centrale

`docs/progetto.md` è il file master. Contiene lo scheletro del progetto,
le macroaree identificate e i link [[obsidian]] a tutti i file .md generati.
Non modificarlo mai parzialmente: o lo leggi, o lo riscrivi completamente.

## Convenzioni Obsidian

- Ogni file .md inizia con frontmatter YAML
- I tag seguono la gerarchia: #macroarea/[nome] #status/[draft|complete|outdated]
- I link tra file usano la sintassi [[nome-file]] senza estensione
- I riferimenti a file di codice usano il percorso relativo dalla root del progetto

## Comportamento generale

- Non inventare mai funzionalità non presenti nel codice
- Se qualcosa non è chiaro, segnalalo con > ⚠️ Da verificare:
- Ogni file .md che crei o modifichi deve aggiornare il proprio frontmatter
- Scrivi sempre in italiano
- I blocchi di codice devono specificare il linguaggio (`tsx, `ts, ```bash)
- I test li effettuo sempre io Marco e non tu (elencami solo cosa testare a fine di ogni fix)
