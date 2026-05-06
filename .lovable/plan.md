## Obiettivo

1. **Audit di unicità**: garantire che ogni pagina pubblica sia >90% diversa dalle altre per struttura, sezioni, CTA e SEO. I testi narrativi sono già unici — l'audit conferma che non ci siano blocchi duplicati di hero/CTA/SEO e corregge dove serve.
2. **Interlinking interno**: ogni pagina deve linkare esplicitamente alle altre rotte rilevanti del sito, **inclusa la home**, oltre al footer (che già le contiene tutte). Questo migliora SEO, crawl e percezione di "sito vivo".

---

## Stato attuale (riassunto audit)

| Pagina | Hero unica | Sezioni interne uniche | Link interni nel body |
|---|---|---|---|
| `/` (Index) | Video hero + Manifesto + Touch + Classics | ✅ | → `/collezioni`, `/chisiamo`, `/sostenibilita` |
| `/collezioni` | Header sobrio + grid prodotti | ✅ | ❌ solo prodotti, nessun link a sostenibilità/scanner/chi siamo |
| `/sostenibilita` | Video hero + carosello fibra + griglia caratteristiche | ✅ | → `/collezioni`, `/product/:id` (manca `/chisiamo`, `/emeraldscanner`) |
| `/chisiamo` | ScrollExpandMedia + Timeline + Stats | ✅ | ❌ solo IG esterno, nessun link interno |
| `/emeraldscanner` | Form scanner + radar + risultato | ✅ | → `/sostenibilita`, `/collezioni` (manca `/chisiamo`) |
| `/faq`, `/resi`, `/privacy`, `/termini` | LegalLayout condiviso (breadcrumb + h1 + body) | ⚠️ struttura identica tra di loro, ma contenuto unico | Solo breadcrumb → `/`. Mancano cross-link tra pagine legali e verso shop |
| `/product/:id` | Galleria + dettagli + recensioni | ✅ | Già linka prodotti correlati |

**Verdetto**: la struttura è già ≥90% differente tra pagine principali. I problemi reali sono:
- Mancano **link interni nel corpo** delle pagine `/chisiamo`, `/collezioni`, `/sostenibilita`, `/emeraldscanner` e legali.
- Le 4 pagine legali hanno layout identico — accettabile per categoria, ma serve almeno un blocco "**Vedi anche**" che le differenzi reciprocamente.

---

## Lavoro da fare

### 1. Nuovo componente `RelatedLinks`
Componente riutilizzabile (`src/components/RelatedLinks.tsx`) che mostra 3 card minimali con: eyebrow, titolo, descrizione breve, link. Estetica coerente con design system (Pure White / Crema / Mint Green / Off-Black, font serif per titoli, Alice per body).

API:
```tsx
<RelatedLinks
  title="Continua a esplorare"
  links={[
    { to: "/", label: "Home", desc: "Torna al manifesto" },
    { to: "/sostenibilita", label: "Sostenibilità", desc: "..." },
    ...
  ]}
/>
```

### 2. Inserire `RelatedLinks` in fondo a ogni pagina pubblica
Selezione mirata (ogni pagina linka **solo le altre rotte rilevanti**, mai sé stessa, sempre la home):

- **`/` (Index)**: aggiungere una sezione "Esplora il mondo Emeraldress" prima del footer con link a `/collezioni`, `/sostenibilita`, `/chisiamo`, `/emeraldscanner`.
- **`/collezioni`** → Home, Sostenibilità, Emerald Scanner, Chi Siamo.
- **`/sostenibilita`** → Home, Collezioni, Emerald Scanner, Chi Siamo.
- **`/chisiamo`** → Home, Sostenibilità, Collezioni, Emerald Scanner.
- **`/emeraldscanner`** → Home, Sostenibilità, Collezioni, Chi Siamo.
- **`/faq`, `/resi`, `/privacy`, `/termini`**: integrare in `LegalLayout` un blocco "Documenti correlati" che linka alle altre 3 pagine legali + Home + Collezioni. Questo differenzia le 4 pagine legali tra loro perché ognuna esclude se stessa.
- **`/product/:id`**: già ha `RelatedProducts`; aggiungere riga finale con link minimal a `/collezioni`, `/sostenibilita`, `/emeraldscanner`.

### 3. SEO check rapido
Verificare che ogni pagina abbia `<title>` e `meta description` distinti (già il caso) e aggiungere `<link rel="canonical">` dove manca (Index ce l'ha, le altre no). Aggiungere canonical a Collezioni, Sostenibilità, ChiSiamo, EmeraldScanner e LegalLayout.

### 4. Pagine escluse dall'interlinking
`/admin`, `/login`, `/reset-password`, `/profilo`, `/coming-soon` — restano standalone come da memoria (`STANDALONE_ROUTES`). Nessun cambio.

---

## File da toccare

- `src/components/RelatedLinks.tsx` *(nuovo)*
- `src/pages/Index.tsx`
- `src/pages/Collezioni.tsx`
- `src/pages/Sostenibilita.tsx`
- `src/pages/ChiSiamo.tsx`
- `src/pages/EmeraldScanner.tsx`
- `src/pages/ProductDetail.tsx`
- `src/pages/legal/LegalLayout.tsx` *(props per links + canonical)*
- `src/pages/legal/Faq.tsx`, `Resi.tsx`, `Privacy.tsx`, `Termini.tsx` *(passare elenco link "vedi anche")*

---

## Cosa NON faccio

- Non riscrivo i contenuti narrativi (sono già unici e curati).
- Non tocco la home oltre l'aggiunta della sezione interlink (hero, manifesto, classics restano).
- Non cambio `/admin`, `/login`, `/profilo`, `/coming-soon`, `/reset-password`.
- Non cambio Footer (già contiene tutti i link globali).

Conferma per procedere.