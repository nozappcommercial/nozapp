# Analisi del Dataset Letterboxd

> Questo file descrive il dataset utilizzato dal sistema dopo aver analizzato tutti i file CSV presenti nella cartella `/dataset`. Il dataset utilizza `id` (relativi ai film) come chiave primaria per collegare le varie entità tabellari.

## Struttura dei File CSV

### 1. `movies.csv` (Dimensione: ~254 MB)
È la tabella principale del dataset che contiene le informazioni di base sui film.
- **`id`**: (Es. `1000001`) Identificativo univoco del film (utilizzato come foreign key in tutti gli altri file).
- **`name`**: (Es. `Barbie`) Titolo del film.
- **`date`**: (Es. `2023`) Anno di uscita.
- **`tagline`**: (Es. `She's everything. He's just Ken.`) Frase di lancio del film.
- **`description`**: Sinossi o descrizione del film.
- **`minute`**: (Es. `114`) Durata in minuti.
- **`rating`**: (Es. `3.86`) Voto medio (presumibilmente su scala 5).

### 2. `actors.csv` (Dimensione: ~195 MB)
Associa gli attori ai film e definisce il ruolo interpretato.
- **`id`**: Riferimento al film.
- **`name`**: (Es. `Margot Robbie`) Nome dell'attore/attrice.
- **`role`**: (Es. `Barbie`) Nome del personaggio o ruolo.

### 3. `themes.csv` (Dimensione: ~5 MB)
Associa tag tematici ai film. Probabilmente questi temi saranno molto utili per calcolare gli `editorial_edges` e i `user_pillars`.
- **`id`**: Riferimento al film.
- **`theme`**: (Es. `Humanity and the world around us`, `Crude humor and satire`) Tema trattato.

### 4. `genres.csv` (Dimensione: ~17 MB)
Definisce il genere o i generi di ogni film.
- **`id`**: Riferimento al film.
- **`genre`**: (Es. `Comedy`, `Adventure`, `Thriller`) Genere.

### 5. `countries.csv` (Dimensione: ~10 MB)
Nazioni di produzione del film.
- **`id`**: Riferimento al film.
- **`country`**: (Es. `UK`, `USA`, `South Korea`) Nazione.

### 6. `languages.csv` (Dimensione: ~28 MB)
Lingue parlate o associate al film, con specificato il tipo.
- **`id`**: Riferimento al film.
- **`type`**: (Es. `Primary language`, `Spoken language`) Ruolo della lingua.
- **`language`**: (Es. `English`, `Korean`) Lingua effettiva.

### 7. `studios.csv` (Dimensione: ~18 MB)
Studi di produzione o distribuzione.
- **`id`**: Riferimento al film.
- **`studio`**: (Es. `LuckyChap Entertainment`, `Heyday Films`) Nome dello studio.

### 8. `posters.csv` (Dimensione: ~94 MB)
Link alle immagini di copertina (poster) resizzate da Letterboxd.
- **`id`**: Riferimento al film.
- **`link`**: URL dell'immagine (Es. `https://a.ltrbxd.com/resized/...-crop.jpg`).

---

## Considerazioni per l'implementazione

1. **Relazione Entità-Relazione**: Il database è fortemente relazionale, con la tabella `movies` (film) che fa da nodo centrale. L'importazione dovrà mantenere questa integrità (possibilmente traducendo gli ID di Letterboxd in UUID, oppure mantenendo gli ID nativi interi come chiave primaria o secondaria unica).
2. **Volumetria Dati**: Alcuni file sono molto pesanti (`movies.csv` è quasi 254 MB, `actors.csv` è quasi 195 MB). Questo significa che il seed script **dovrà necessariamente utilizzare degli Stream** (es. `csv-parser` o modulo `readline`) per leggere i file ed eseguire insert a lotti (batching/bulk insert), per non saturare la memoria (OOM).
3. **Temi e Generi per grafo**: I file `themes.csv` e `genres.csv` forniranno un'ottima base sintetica (mock, o reale se supportata) per la generazione algoritmica dei collegamenti "similiari" o "contrastanti" della sfera semantica.