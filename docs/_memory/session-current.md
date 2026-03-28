---
date: 2026-03-28
status: active
---

## 17:20 [tipo: bug-fix]

**File toccati**:

- `src/components/admin/AdminHeader.tsx` — Implementata la chiamata `router.refresh()` nel tasto refresh per forzare la ricarica dei Server Components.
- `src/app/admin/analisi/page.tsx` — Aggiunto listener per l'evento di refresh globale per ricaricare le statistiche via client.
- `src/app/admin/cinema/page.tsx` — Aggiunto listener per ricaricare la lista film in tempo reale.

**Problema di partenza**: Il tasto refresh nell'header admin funzionava solo sulla pagina Utenti. Nelle altre sezioni era puramente estetico (non triggerava alcuna azione).
**Soluzione applicata**: Centralizzata la logica di refresh nell'header (mix tra `router.refresh()` per componenti server e `CustomEvent` per componenti client) e registrati i listener necessari nelle varie dashboard.
**Side effects**: Nessuno. Ora l'intera area admin risponde correttamente al comando di ricarica senza dover ricaricare l'intero browser.

---

## 17:25 [tipo: bug-fix]

**File toccati**:

- `src/app/actions/admin_analytics.ts` — Migrata la logica di recupero dati dal client standard (`anon`) al client `admin` (service_role) per bypassare le policy RLS e visualizzare correttamente il conteggio totale degli utenti. Aggiunta verifica esplicita del ruolo admin per sicurezza.

**Problema di partenza**: La Dashboard e la pagina Analisi mostravano solo 1 utente iscritto, nonostante su Supabase ne fossero presenti 3. Questo accadeva perché il client utilizzato rispettava le restrizioni RLS, limitando la vista ai soli dati dell'utente loggato.
**Soluzione applicata**: Implementato l'uso di `createAdminClient()` all'interno della Server Action `getDashboardAnalytics`, garantendo che le statistiche aggregate riflettano l'intero database.
**Side effects**: Nessuno. La sicurezza è garantita dal check preliminare `is_admin` sull'ID dell'utente che effettua la richiesta.

---

## 18:05 [tipo: feature]

**File toccati**:

- `src/app/redazione/[slug]/page.tsx` — Introdotta animazione fade-in allo scroll per l'immagine di copertina, ottimizzate le spaziature del footer articolo e aggiornato il testo del pulsante CTA ("TORNA ALLA SFERA"). Rimosso lo spazio bianco in eccesso sotto il footer.
- `src/app/actions/editorial.ts` — Implementata l'azione server `getArchivedArticles` per recuperare lo storico completo degli articoli pubblicati (inclusi quelli scaduti), garantendo una navigazione coerente nell'Archivio.
- `src/components/layout/Footer.tsx` — Aggiornati i link permanenti per puntare alle nuove rotte istituzionali (`/manifesto`, `/redazione-info`, `/archivio`, `/contatti`).
- `src/app/manifesto/page.tsx` — [NEW] Pagina dedicata alla visione "slow" e curatoriale del progetto NoZapp.
- `src/app/redazione-info/page.tsx` — [NEW] Template elegante con i profili dei membri del team e i rispettivi ruoli.
- `src/app/archivio/page.tsx` — [NEW] Biblioteca digitale completa di tutti gli articoli pubblicati.
- `src/app/contatti/page.tsx` — [NEW] Pagina minimale per facilitare il dialogo e presentare i canali social.

**Problema di partenza**: La pagina articolo necessitava di un raffinamento estetico e mancavano le sezioni istituzionali e l'archivio storico richiesti per completare la navigazione del sito.
**Soluzione applicata**: Ottimizzato il template articolo, creata l'azione server necessaria per l'archivio e sviluppate le quattro nuove pagine con design premium e testi dummy di alta qualità.
**Side effects**: Nessuno. La navigazione globale tramite footer è ora pienamente operativa.

---

## 18:35 [tipo: refactor | UI]

**File toccati**:

- `src/components/layout/Header.tsx` — Disabilitato l'header globale su tutte le rotte editoriali/istituzionali.
- `src/components/layout/BackToTop.tsx` — [NEW] Componente per il ritorno a inizio pagina.
- `src/app/redazione/[slug]/page.tsx`, `src/app/manifesto/page.tsx`, `src/app/archivio/page.tsx`, `src/app/redazione-info/page.tsx`, `src/app/contatti/page.tsx`, `src/app/redazione/page.tsx` — Allineamento breadcrumb, riduzione padding superiore e integrazione `BackToTop`.
- `src/app/manifesto/page.tsx` — Aggiunta linea dorata verticale superiore per simmetria "pergamena".

**Problema di partenza**: L'header globale disturbava l'immersività delle pagine editoriali; i breadcrumb erano disallineati e troppo distanti dal bordo superiore. Mancava un sistema di ritorno rapido a inizio pagina.
**Soluzione applicata**: Rimosso l'header sulle rotte specifiche, ricalibrato il layout dei breadcrumb per allinearli ai contenuti e introdotto un pulsante "Torna Su" minimale e centrato.
**Side effects**: Nessuno. L'esperienza di lettura è ora più pulita e focalizzata.

---

## 19:45 [tipo: feature | refactor]

**File toccati**:

- `src/app/redazione/page.tsx` — Migrazione dei contenuti dalla rotta `/redazione-info` e rimozione della vecchia lista articoli.
- `src/components/layout/RouteProgress.tsx` — [NEW] Componente globale per feedback di caricamento e reset dello scroll su ogni cambio pagina.
- `src/app/layout.tsx` — Integrazione di `RouteProgress` all'interno di un Suspense boundary.
- `src/app/redazione/[slug]/page.tsx` e `src/app/manifesto/page.tsx` — Implementazione delle sezioni Hero "Title-first" con altezza `min-h-[90vh]` e indicatori di scroll.
- `src/components/layout/BackToTop.tsx` — Ottimizzato il centramento tramite `w-max` e allineamento all'asse centrale.
- `src/components/layout/Footer.tsx` e `src/components/layout/Header.tsx` — Aggiornati i link e la logica di visibilità per riflettere le nuove rotte.

**Problema di partenza**: Necessità di feedback visivo immediato durante la navigazione, desiderio di un impatto visivo più monumentale nei titoli di apertura e pulizia delle rotte editoriali.
**Soluzione applicata**: Riprogettate le sezioni Hero per bloccare la visuale iniziale sul solo titolo, introdotta una barra di avanzamento dorata superiore e consolidata la rotta `/redazione` eliminando i ridondanti.
**Side effects**: Nessuno. La navigazione risulta ora più "intenzionale" e gratificante.

---
