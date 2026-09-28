# Pauzeo – web

Web pro wellbeing boxy Pauzeo (Kapka, Vlna, Oceán). Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion, ikony Lucide.

## Spuštění

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # produkce
```

## Struktura

- `app/page.tsx` – skládá sekce stránky
- `data/boxes.ts` – **všechny texty, ceny, barvy a obsah boxů** (tady se mění nabídka)
- `components/BoxScene.tsx` – animace boxu (víko se zvedne, věci vyletí do oblouku)
- `components/Variants.tsx` – přepínání Kapka / Vlna / Oceán a pánská / dámská náplň
- `components/ContactForm.tsx` – poptávkový formulář
- `app/api/poptavka/route.ts` – přijímá poptávky (zatím jen loguje, viz TODO)

## Před spuštěním naostro

- Napojit `app/api/poptavka/route.ts` na e-mail (např. Resend) nebo CRM.
- Změnit kontaktní e-mail `ahoj@pauzeo.cz` ve `components/Footer.tsx`.
- Ponechat benefit „Balení v chráněné dílně s možností náhradního plnění“ jen pokud ho skutečně nabízíte (`components/ForCompanies.tsx`).
- Ověřit ceny a obsah boxů v `data/boxes.ts`.

## Nasazení

Nejjednodušší je Vercel: import repozitáře z GitHubu, žádná další konfigurace není potřeba.
