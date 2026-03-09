"""
translate_movie_titles.py
─────────────────────────────────────────────────────────────────────────────
Legge il file movies.csv, cerca ogni titolo su Wikidata SPARQL e aggiunge
la colonna `title_it` con il titolo italiano ufficiale.

Strategia:
  1. Wikidata SPARQL  →  titolo italiano ufficiale
  2. Se non trovato   →  lascia il titolo originale inglese (no Google Translate)

Uso:
  pip install pandas requests tqdm
  python translate_movie_titles.py

Output:
  movies_with_italian_titles.csv  (nella stessa cartella del CSV originale)
  wikidata_cache.json             (cache per non rieseguire le stesse query)
─────────────────────────────────────────────────────────────────────────────
"""

import pandas as pd
import requests
import json
import time
import re
import os
from tqdm import tqdm

# ─── CONFIGURAZIONE ──────────────────────────────────────────────────────────

CSV_INPUT  = "/Volumes/Crucial/workspace/web/nozapp/dataset/movies.csv"
CSV_OUTPUT = "/Volumes/Crucial/workspace/web/nozapp/dataset/movies_with_italian_titles.csv"
CACHE_FILE = "/Volumes/Crucial/workspace/web/nozapp/scripts/wikidata_cache.json"

TITLE_COLUMN = "name"          # Colonna con il titolo inglese
DELAY        = 1.0             # Secondi di pausa tra richieste (rispetta le policy Wikidata)
BATCH_SAVE   = 500             # Salva il CSV ogni N film processati

TEST_MODE    = True            # ⚠️ True = processa solo i primi N film (per test)
TEST_ROWS    = 30              # Numero di film da processare in modalità test

# ─── WIKIDATA SPARQL ─────────────────────────────────────────────────────────

WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql"
HEADERS = {
    "User-Agent": "MovieTitleTranslator/1.0 (nozapp; python-requests)",
    "Accept": "application/sparql-results+json",
}

def build_query(title: str) -> str:
    """Costruisce la query SPARQL per cercare un film per titolo inglese."""
    safe_title = title.replace("\\", "\\\\").replace('"', '\\"')
    return f"""
    SELECT ?item ?itemLabel ?titleIT WHERE {{
      ?item wdt:P31 wd:Q11424 .
      ?item rdfs:label "{safe_title}"@en .
      OPTIONAL {{
        ?item rdfs:label ?titleIT .
        FILTER(LANG(?titleIT) = "it")
      }}
      SERVICE wikibase:label {{
        bd:serviceParam wikibase:language "it,en" .
      }}
    }}
    LIMIT 1
    """

def build_query_relaxed(title: str) -> str:
    """Query alternativa con ricerca case-insensitive (fallback)."""
    safe_title = title.replace("\\", "\\\\").replace('"', '\\"')
    return f"""
    SELECT ?item ?itemLabel ?titleIT WHERE {{
      ?item wdt:P31 wd:Q11424 .
      ?item rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      FILTER(LCASE(STR(?label)) = LCASE("{safe_title}"))
      OPTIONAL {{
        ?item rdfs:label ?titleIT .
        FILTER(LANG(?titleIT) = "it")
      }}
      SERVICE wikibase:label {{
        bd:serviceParam wikibase:language "it,en" .
      }}
    }}
    LIMIT 1
    """

def query_wikidata(title: str) -> str | None:
    """
    Cerca il titolo italiano su Wikidata.
    Prova prima con query esatta, poi con query case-insensitive.
    Ritorna il titolo italiano o None se non trovato.
    """
    for query_fn in [build_query, build_query_relaxed]:
        try:
            response = requests.get(
                WIKIDATA_ENDPOINT,
                params={"query": query_fn(title), "format": "json"},
                headers=HEADERS,
                timeout=15,
            )
            if response.status_code == 429:
                print(f"\n⚠️  Rate limit raggiunto, attendo 30 secondi...")
                time.sleep(30)
                continue
            if response.status_code != 200:
                return None

            data = response.json()
            results = data.get("results", {}).get("bindings", [])

            if not results:
                continue

            row = results[0]

            if "titleIT" in row:
                return row["titleIT"]["value"]
            if "itemLabel" in row:
                label = row["itemLabel"]["value"]
                if not re.match(r"^Q\d+$", label):
                    return label

        except requests.exceptions.Timeout:
            print(f"\n⏱️  Timeout per: {title}")
        except Exception as e:
            print(f"\n❌  Errore per '{title}': {e}")

        time.sleep(DELAY)

    return None

# ─── CACHE ───────────────────────────────────────────────────────────────────

def load_cache() -> dict:
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_cache(cache: dict):
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    global CSV_OUTPUT

    print("🎬 Movie Title Translator — Wikidata SPARQL")
    print("=" * 50)

    # Carica il CSV
    print(f"\n📂 Carico: {CSV_INPUT}")
    df = pd.read_csv(CSV_INPUT, low_memory=False)
    print(f"   {len(df):,} film trovati nel dataset completo")

    if TITLE_COLUMN not in df.columns:
        raise ValueError(f"Colonna '{TITLE_COLUMN}' non trovata. Colonne disponibili: {list(df.columns)}")

    # ── Modalità test ──
    if TEST_MODE:
        df = df.head(TEST_ROWS).copy()
        CSV_OUTPUT = CSV_OUTPUT.replace(".csv", f"_test{TEST_ROWS}.csv")
        print(f"\n🧪 TEST MODE attivo — elaboro solo i primi {TEST_ROWS} film")
        print(f"   Output: {CSV_OUTPUT}")

    # Aggiunge la colonna title_it se non esiste già
    if "title_it" not in df.columns:
        df["title_it"] = None

    # Carica la cache
    cache = load_cache()
    print(f"\n🗄️  Cache: {len(cache):,} titoli già presenti")

    # Identifica i film da processare (title_it ancora vuoto)
    mask_todo = df["title_it"].isna()
    todo_indices = df[mask_todo].index.tolist()
    print(f"⏳ Film da tradurre: {len(todo_indices):,}\n")

    if not todo_indices:
        print("✅ Tutti i titoli sono già stati tradotti!")
        df.to_csv(CSV_OUTPUT, index=False)
        return

    # Statistiche
    found     = 0
    not_found = 0

    # Loop principale
    for i, idx in enumerate(tqdm(todo_indices, desc="Traducendo", unit="film")):
        title_en = str(df.at[idx, TITLE_COLUMN]).strip()

        # Controlla la cache
        if title_en in cache:
            df.at[idx, "title_it"] = cache[title_en]
            if cache[title_en] != title_en:
                found += 1
            else:
                not_found += 1
            continue

        # Cerca su Wikidata
        title_it = query_wikidata(title_en)

        if title_it and title_it.lower() != title_en.lower():
            df.at[idx, "title_it"] = title_it
            cache[title_en] = title_it
            found += 1
            tqdm.write(f"  ✅  {title_en}  →  {title_it}")
        else:
            df.at[idx, "title_it"] = title_en
            cache[title_en] = title_en
            not_found += 1
            tqdm.write(f"  ❌  {title_en}  (non trovato, mantenuto EN)")

        # Pausa tra richieste
        time.sleep(DELAY)

        # Salvataggio intermedio ogni BATCH_SAVE film
        if (i + 1) % BATCH_SAVE == 0:
            df.to_csv(CSV_OUTPUT, index=False)
            save_cache(cache)
            pct = found / (found + not_found) * 100 if (found + not_found) > 0 else 0
            tqdm.write(f"\n💾 Salvato — Trovati: {found:,} ({pct:.1f}%) | Non trovati: {not_found:,}\n")

    # Salvataggio finale
    df.to_csv(CSV_OUTPUT, index=False)
    save_cache(cache)

    # Report finale
    total = found + not_found
    print("\n" + "=" * 50)
    print("✅ Completato!")
    print(f"   🟢 Titoli italiani trovati : {found:,} ({found/total*100:.1f}%)")
    print(f"   🔴 Non trovati (EN usato)  : {not_found:,} ({not_found/total*100:.1f}%)")
    print(f"\n📄 Output: {CSV_OUTPUT}")
    print(f"🗄️  Cache:  {CACHE_FILE}")

    # Anteprima risultati in modalità test
    if TEST_MODE:
        print("\n📋 Anteprima risultati:")
        print(df[[TITLE_COLUMN, "title_it"]].to_string(index=True))

if __name__ == "__main__":
    main()
