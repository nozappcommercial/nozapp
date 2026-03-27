updated: 2026-03-26
agent: aggiornatore
---

# Tipi e Interfacce TypeScript

[← Torna all'indice](./progetto.md)

## Fondamenta
NoZapp è sviluppato interamente in TypeScript con tipizzazione rigorosa per garantire la stabilità del grafo e delle interazioni.

## Tipi Database (`src/types/supabase.ts`)
Generati automaticamente tramite Supabase CLI, definiscono lo schema esatto delle tabelle e dei JSON.

| Tabella | Tipo Principale | Descrizione |
| :--- | :--- | :--- |
| `films` | `Film` | Metadati statici del film (titolo, anno, ecc.). |
| `user_onboarding_results` | `OnboardingResult` | Configurazione JSON dei risultati del wizard. |
| `security_logs` | `SecurityLog` | Record degli audit di sicurezza. |
| `articles` | `Article` | Contenuti redazionali (titolo, slug, contenuto). |
| `users` | `User` | Profili utente estesi con flag `is_admin`, `onboarding_complete` e timestamp MFA (`admin_verified_at`). |

## Tipi del Grafo (`src/lib/graph/`)
Utilizzati dallo Sphere Engine per il rendering e la navigazione.

- **`FilmNode`**: Rappresenta un nodo nella sfera.
  - `id`: number
  - `title`: string
  - `shell`: 0 | 1 | 2
  - `geometry`: { x, y, z }
- **`FilmEdge`**: Rappresenta una relazione tra due film.
  - `source`: number (ID film)
  - `target`: number (ID film)
  - `type`: 'affinity' | 'pillar' | 'contrast'
- **`NavContext`**: Lo stato della navigazione corrente.
  - `current`: ID film selezionato.
  - `parent`: ID film genitore nel percorso di navigazione.
  - `visible`: Set di ID film da renderizzare.

## Tipi Onboarding (`app/onboarding/page.tsx`)
- **`OnboardingFilm`**: Estensione di `Film` con l'aggiunta di `onboarding_group` e campi colore personalizzati (`color_primary`, `color_accent`).

---

## Relazioni tra Tipi
```mermaid
classDiagram
    class Database {
        films
        users
        user_pillars
    }
    class FilmNode {
        number id
        string title
        number shell
    }
    class NavContext {
        number current
        number parent
        Set visible
    }
    Database --|> FilmNode : mapping
    FilmNode --|> NavContext : state transition
```

## Note su `any`
L'utilizzo del tipo `any` è scoraggiato e limitato esclusivamente a:
- Risposte da API esterne non ancora tipizzate (es. TMDB in fase di sviluppo rapido).
- Interfacce Three.js dove la tipizzazione nativa è troppo complessa (contrassegnato da `@ts-nocheck`).

---
> [!IMPORTANT]
> Quando modifichi lo schema del database su Supabase, ricordati di rigenerare i tipi tramite `npx supabase gen types typescript --project-id ... > src/types/supabase.ts`.

🔄 **Aggiornato il 2026-03-26**: Inseriti i tipi per il sistema editoriale e le estensioni MFA dei profili utente.
