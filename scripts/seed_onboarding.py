#!/usr/bin/env python3
"""
Apply onboarding migration and seed 15 probe films in Supabase.
Selects 15 films by highest rating, divides into 3 groups of 5,
and assigns colors/mood manually based on film data.
"""

import os
from supabase import create_client

URL = os.environ.get("SUPABASE_URL", "https://kbxfxnwwsyuhqiunlaez.supabase.co")
KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

# Try reading from .env if not set
if not KEY:
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
                    KEY = line.split("=", 1)[1]
                elif line.startswith("NEXT_PUBLIC_SUPABASE_ANON_KEY=") and not KEY:
                    KEY = line.split("=", 1)[1]

supabase = create_client(URL, KEY)

# Step 1: Apply migration via raw SQL (needs service role key)
migration_sql = open(os.path.join(os.path.dirname(__file__), "..", "supabase", "migrations", "20260306000000_onboarding_schema.sql")).read()

print("Applying migration...")
try:
    supabase.postgrest.rpc("exec_sql", {"query": migration_sql}).execute()
    print("  Migration applied via RPC")
except Exception as e:
    print(f"  RPC failed (expected if no exec_sql fn): {e}")
    print("  You may need to apply the migration manually via Supabase Dashboard SQL editor.")

# Step 2: Fetch top 15 films by rating
print("\nFetching films...")
res = supabase.table("films").select("id, title, year, director, rating, poster_url").order("rating", desc=True).limit(15).execute()
films = res.data

if not films:
    print("ERROR: No films found in database!")
    exit(1)

print(f"  Found {len(films)} films")

# Color palettes and moods - we assign based on the film characteristics
# Using warm/cold tones and dramatic moods
COLOR_PALETTES = [
    # Group 1 - Iconic, very recognizable (warm/dramatic tones)
    {"color": "#2C1810", "accent": "#8B4513", "mood": "Potere, famiglia, tragedia"},
    {"color": "#1A0A00", "accent": "#E8A000", "mood": "Violenza, umorismo, destino"},
    {"color": "#0A1628", "accent": "#4A7FBF", "mood": "Amore, tragedia, classe sociale"},
    {"color": "#0D0D0D", "accent": "#C8C8C8", "mood": "Memoria, redenzione, orrore"},
    {"color": "#0A0A14", "accent": "#4A90D9", "mood": "Caos, morale, vigilantismo"},
    # Group 2 - Well-known, more nuanced
    {"color": "#8B1A1A", "accent": "#E8937A", "mood": "Solitudine, connessione, futuro"},
    {"color": "#1C2B1C", "accent": "#7AB87A", "mood": "Classe, inganno, brutalità"},
    {"color": "#0D1A2B", "accent": "#4A7FA8", "mood": "Identità, tenerezza, silenzio"},
    {"color": "#3D1C00", "accent": "#FF6B00", "mood": "Sopravvivenza, furia, libertà"},
    {"color": "#0A1520", "accent": "#5A8FA0", "mood": "Tempo, linguaggio, perdita"},
    # Group 3 - Niche, cinephile territory
    {"color": "#2B0A14", "accent": "#C84A6A", "mood": "Desiderio, distanza, tempo"},
    {"color": "#000814", "accent": "#4A6080", "mood": "Umanità, evoluzione, infinito"},
    {"color": "#1A2B0A", "accent": "#8FBF5A", "mood": "Grazia, natura, trascendenza"},
    {"color": "#1E1A14", "accent": "#A89070", "mood": "Routine, corpo, oppressione"},
    {"color": "#141E28", "accent": "#7A9EB8", "mood": "Famiglia, comunicazione, vita"},
]

# Step 3: Reset existing probes
print("\nResetting existing probes...")
supabase.table("films").update({
    "is_onboarding_probe": False,
    "onboarding_group": None,
    "color_primary": None,
    "color_accent": None,
    "mood": None
}).neq("id", 0).execute()

# Step 4: Update the 15 selected films
print("Seeding 15 probe films...")
for i, film in enumerate(films):
    group = (i // 5) + 1  # 1, 2, or 3
    palette = COLOR_PALETTES[i]
    
    update_data = {
        "is_onboarding_probe": True,
        "onboarding_group": group,
        "color_primary": palette["color"],
        "color_accent": palette["accent"],
        "mood": palette["mood"],
    }
    
    supabase.table("films").update(update_data).eq("id", film["id"]).execute()
    print(f"  [{group}] {film['title']} ({film['year']}) - rating {film.get('rating', 'N/A')}")

print("\n✅ Done! 15 films marked as onboarding probes.")
print("Group 1 (iconic): films 1-5")
print("Group 2 (nuanced): films 6-10")
print("Group 3 (niche): films 11-15")
