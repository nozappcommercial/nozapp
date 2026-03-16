# Report Tecnico-Strategico: Popolamento della Sfera Semantica

Il presente documento illustra le metodologie per il popolamento dei livelli di navigazione (Shell) all'interno dell'applicazione NoZapp. L'obiettivo è definire la logica di transizione dai "Pilastri" dell'utente verso la scoperta di nuovi contenuti cinematografici.

---

## Componenti Fondamentali della Rete

Per comprendere le strategie di suggerimento, è necessario definire i componenti che costituiscono l'architettura dei dati.

### 1. Pilastri (Shell 0)
Rappresentano i film selezionati dall'utente durante la fase di onboarding. Costituiscono il punto di origine (Shell 0) per la generazione della sfera personalizzata.

### 2. Collegamenti Editoriali (Editorial Edges)
Questi elementi rappresentano connessioni manuali e curate inserite direttamente nel database.
- **Definizione**: Un record che stabilisce una relazione semantica tra un Film A e un Film B.
- **Struttura**: Ogni collegamento è corredato da una categoria (tematica, stilistica, contrasto) e da una nota testuale che motiva la connessione.
- **Funzione**: Trasferire la competenza critica del team editoriale all'interno dell'algoritmo di navigazione.

### 3. Sistema di Pesi
Ogni collegamento editoriale è associato a un valore numerico (peso) compreso tra 0.1 e 1.0.
- **Significato**: Il peso indica la forza della correlazione tra i due titoli.
- **Impatto Visivo**: Un peso elevato (es. 0.9) determina una maggiore prossimità spaziale e una dimensione superiore del nodo nella visualizzazione 3D, indicando una raccomandazione forte. Un peso ridotto indica una correlazione suggerita ma meno diretta.

### 4. Metadati (Tag e Generi)
Informazioni strutturate (regista, anno, generi, temi) utilizzate dal sistema per identificare affinità in assenza di collegamenti manuali.

---

## Analisi degli Approcci di Scoperta

### Approccio 1: Curatela Editoriale Pura
Il sistema visualizza esclusivamente i collegamenti definiti manualmente nella tabella degli archi editoriali.
- **Logica**: Se un utente seleziona un film pilastro, la sfera mostrerà solo i titoli che il team editoriale ha collegato esplicitamente ad esso.
- **Applicazione**: Ideale per garantire la massima autorevolezza e precisione dei suggerimenti. Richiede un database di collegamenti ampio per evitare che la sfera risulti vuota per alcuni utenti.

### Approccio 2: Sistema Ibrido (Consigliato)
Integrazione tra collegamenti manuali e automazione basata sui metadati.
- **Logica**: Il sistema interroga prioritariamente i collegamenti editoriali. In caso di insufficienza di dati (sfera troppo sparsa), interviene un algoritmo di fallback che identifica titoli simili tramite temi e generi comuni.
- **Applicazione**: Assicura un'esperienza utente sempre ricca e funzionale fin dal primo accesso, permettendo al contempo di valorizzare le connessioni manuali ovunque presenti.

### Approccio 3: Discovery e Varietà (Serendipity)
Iniezione di contenuti diversificati nel livello più esterno della sfera (Shell 2).
- **Logica**: Una frazione dei nodi visualizzati non deriva da legami diretti con i pilastri, ma da una selezione di titoli di alta qualità o di rilievo storico presenti nel database.
- **Applicazione**: Utile per espandere gli orizzonti dell'utente e prevenire la saturazione dei suggerimenti verso un unico genere o filone.

### Approccio 4: Analisi Semantica Vettoriale
Utilizzo di modelli di intelligenza artificiale per il calcolo della distanza semantica tra i film.
- **Logica**: Confronto delle descrizioni e delle sinossi per trovare affinità di "atmosfera" o "stile narrativo" che prescindono dai tag tradizionali.
- **Applicazione**: Soluzione avanzata per scalare la scoperta su migliaia di titoli in modo automatizzato, mantenendo un alto livello di pertinenza.

---

## Considerazioni sulla Propagazione
È importante sottolineare che ogni collegamento editoriale inserito nel sistema è **globale**. Un ponte creato tra due titoli non è limitato a un singolo utente, ma arricchisce l'intera mappa cinematografica del progetto. La personalizzazione avviene alla base: ogni utente esplorerà la mappa partendo dai propri pilastri, visualizzando i nodi e le shell corrispondenti alla propria posizione nella rete.

## Raccomandazione Strategica
Si consiglia l'adozione dell'**Approccio 2 (Ibrido)**. Questa soluzione garantisce la continuità dell'esperienza d'uso (sfera sempre popolata) e permette al team editoriale di concentrarsi sulla creazione di connessioni di alto valore, che il sistema riconoscerà e premierà automaticamente rispetto ai legami generati dai metadati.
