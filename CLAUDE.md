# Pauzeo – projekt a verze

> **Aktuální verze: 1.6** (zobrazuje se v patičce webu, zdroj `lib/version.ts`)
> Při každém vydání: zvýšit verzi v `lib/version.ts`, přidat záznam do Changelogu níže, `npm run build`, push na `main`.

## O projektu

Pauzeo jsou **wellbeing boxy pro firmy** v ČR a SK. Firma předplatí boxy pro zaměstnance a každé čtvrtletí přijde box se **6 věcmi od českých manufaktur**.

- **3 varianty:** Kapka (890 Kč), Vlna (1 490 Kč), Oceán (2 990 Kč), ceny bez DPH, upravitelné v administraci
- **Pánská i dámská náplň** za stejnou cenu
- **4 edice ročně:** Jaro (duben), Léto (červenec), Podzim (říjen), Zima (leden)
- **Aktuální edici** (co se právě prodává, uzávěrka, doručení, otevřeno/zavřeno) nastavuje admin
- **Model:** předplatné, platba předem za čtvrtletí, zboží se nakupuje až po uzávěrce, minimum 10 boxů
- **Repo:** `github.com/Dohnos/PZEO`, větev `main` se automaticky nasazuje na Vercel

## Stránky

| Cesta | Co to je |
|---|---|
| `/` | Veřejný web: hero s AI obrázkem, varianty s 3D animací, 4 edice, jak to funguje, FAQ, poptávka |
| `/admin` | Administrace (heslo `ADMIN_PASSWORD`): edice, boxy a produkty, objednávky, klienti, poptávky |
| `/klient` | Klientská sekce (e-mail + přístupový kód): aktuální objednávka se stavem, objednání aktuální edice, historie, údaje o firmě |

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- Framer Motion (animace), lucide-react (ikony)
- three.js + @react-three/fiber + drei (3D krabice, načítá se líně, s 2D zálohou bez WebGL)
- Fonty `@fontsource-variable`: Fraunces (nadpisy, osa SOFT) a Figtree (text)
- Úložiště: **Upstash Redis** přes REST (`lib/store.ts`), bez něj ukázkový režim v paměti

## Proměnné prostředí (Vercel → Settings → Environment Variables)

| Proměnná | Účel |
|---|---|
| `ADMIN_PASSWORD` | Heslo do `/admin` (bez něj je administrace vypnutá) |
| `AUTH_SECRET` | Tajemství pro podpis přihlášení (doporučeno, jinak se odvodí z hesla) |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Upstash Redis (vytvoří se samy po připojení Storage → Upstash for Redis). Alternativně `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` |

Bez Redis běží **ukázkový režim**: data jsou v paměti serveru, po restartu se ztratí. Existuje demo klient `demo@pauzeo.cz` / `demo2026`.

## Struktura

- `lib/types.ts` – datové typy (katalog, edice, klient, objednávka, poptávka, klíče ikon a 3D modelů)
- `lib/seed.ts` – výchozí katalog a demo data
- `lib/store.ts` – čtení a zápis (Redis / paměť), klíče `pauzeo:catalog|clients|orders|leads`
- `lib/validate.ts` – kontrola dat z administrace
- `lib/auth.ts`, `lib/crypto.ts` – podepsané cookies, hash přístupových kódů (scrypt)
- `lib/labels.ts` – české popisky (období, stavy objednávek, ikony, 3D modely), formátování
- `lib/version.ts` – verze webu
- `data/boxes.ts` – barevná témata variant a převod dat na zobrazení
- `components/Box3D.tsx` – 3D scéna (kulatá krabice, víko, představení věcí jedna po druhé)
- `components/Models3D.tsx` – **knihovna 3D modelů produktů**
- `components/admin/*`, `components/klient/*` – administrace a klientská sekce
- `app/api/admin`, `app/api/klient`, `app/api/poptavka` – API

## 3D modely produktů

Každá věc v boxu má v administraci zvolený 3D model (`model`). Knihovna: plechovka, svíčka ve skle, svíčka v keramice, tuba, lahvička roll-on, lahvička s kapátkem, kelímek s balzámem, masážní míček, masážní váleček, masážní válec, masážní pistole, gua sha, karta, voucher, deník, med, sklenice, čokoláda.

**Nový produkt bez modelu:** majitel pošle popis a fotku → přidat komponentu do `Models3D.tsx`, klíč do `ModelKey` (`lib/types.ts`) a popisek do `modelLabels` (`lib/labels.ts`), vydat novou verzi.

## Design systém

- Barvy: mlha `#EDF2F0`, hlubina `#0F2A36`, vlna `#2E6B6F`, oceán `#10222F`, zlato `#C9A45C`, písek `#E8D6AC`
- Logo: lístek + „PAUZEO“ verzálkami s prostrkáním (`components/Logo.tsx`), favicon `app/icon.svg`
- Kulaté prvky: tlačítka pilulky, panely 28–48 px, ikony v kruzích
- Texty česky, krátce; žádné emoji v UI; respektovat `prefers-reduced-motion`; mobil je priorita

## Otevřené TODO

- E-mailové upozornění na novou poptávku a objednávku (např. Resend)
- Kontaktní e-mail `ahoj@pauzeo.cz` je zástupný
- Benefit „balení v chráněné dílně“ je na webu jen pokud platí
- Fakturace (napojení na účetní systém)

## Changelog

### 1.6
- Štítek „Wellbeing boxy pro firmy“ v úvodu (na mobilu hned pod menu)
- Aktuální edice v sekci „Vyberte si box“ a zvýraznění „Právě v prodeji“ v ročních obdobích
- Administrace `/admin`: edice, boxy a produkty (včetně ikon a 3D modelů), objednávky, klienti s přístupovými kódy, poptávky z webu, přehled edice
- Klientská sekce `/klient`: stav objednávky, objednání aktuální edice, historie, údaje o firmě
- Úložiště Upstash Redis s ukázkovým režimem
- 3D animace podle konkrétních produktů (knihovna 18 modelů)
- Verze v patičce, odkaz na klientskou sekci v menu a patičce

### 1.5
- 3D kulatá krabice (three.js), víko se zvedne a opře, věci se představí jedna po druhé s popiskem
- Sekce „Čtyři boxy za rok“ (Jaro, Léto, Podzim, Zima)
- Slogan „Váš tým nechce další víno ani klobásy.“ s animovaným přeškrtnutím

### 1.4
- Odstraněné dekorativní kruhy v úvodu, přepínač variant se už nepřilepuje

### 1.3
- AI obrázek na mobilu hned pod menu, sjednocené logo s lístkem, favicon

### 1.2
- AI obrázek v hero (`public/hero.webp`)

### 1.1
- Výrazný přepínač variant se šipkami a swipem, zjednodušený obsah, pás produktů, kruhové grafy, scroll animace

### 1.0
- První verze webu: Next.js, varianty Kapka/Vlna/Oceán, animovaný box, poptávkový formulář
