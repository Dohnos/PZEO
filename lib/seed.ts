import type { Catalog, Client, Lead, Order } from "@/lib/types";

/** Výchozí nabídka. Použije se, dokud admin nic neuloží. */
export const seedCatalog: Catalog = {
  updatedAt: "2026-09-30T00:00:00.000Z",
  edition: {
    season: "zima",
    year: 2027,
    deadline: "2026-12-15",
    delivery: "leden 2027",
    open: true,
  },
  boxes: [
    {
      id: "kapka",
      name: "Kapka",
      tagline: "Malá pauza pro každý den",
      description: "Šest drobností do běžného dne pro celý tým.",
      price: 890,
      items: {
        zeny: [
          { name: "Relaxační bylinný čaj", detail: "Sypaný, 50 g", icon: "coffee", model: "tin" },
          { name: "Sójová svíčka", detail: "60 ml, květinová vůně", icon: "flame", model: "candle" },
          { name: "Krém na ruce", detail: "Přírodní kosmetika", icon: "droplet", model: "tube" },
          { name: "Masážní míček", detail: "Na záda i chodidla", icon: "circleDot", model: "ball" },
          { name: "Karta s dechovým cvičením", detail: "S QR kódem na audio", icon: "wind", model: "card" },
          { name: "Čokoláda z manufaktury", detail: "95 g", icon: "cookie", model: "chocolate" },
        ],
        muzi: [
          { name: "Zázvorový čaj", detail: "Sypaný, 50 g", icon: "coffee", model: "tin" },
          { name: "Sójová svíčka", detail: "60 ml, cedr a borovice", icon: "flame", model: "candle" },
          { name: "Univerzální balzám", detail: "Na ruce i obličej", icon: "droplet", model: "balm" },
          { name: "Masážní míček", detail: "Na záda i chodidla", icon: "circleDot", model: "ball" },
          { name: "Karta s dechovým cvičením", detail: "S QR kódem na audio", icon: "wind", model: "card" },
          { name: "Hořká čokoláda", detail: "95 g z manufaktury", icon: "cookie", model: "chocolate" },
        ],
      },
    },
    {
      id: "vlna",
      name: "Vlna",
      tagline: "Pauza, která tě ponese",
      description: "Nejčastější volba pro pravidelný benefit, s deníkem na celé čtvrtletí.",
      price: 1490,
      items: {
        zeny: [
          { name: "Prémiový čaj", detail: "V plechovce na doplňování", icon: "coffee", model: "tin" },
          { name: "Sójová svíčka", detail: "180 ml, meduňka", icon: "flame", model: "candle" },
          { name: "Aroma balzám proti stresu", detail: "S esenciálními oleji", icon: "sparkles", model: "bottle" },
          { name: "Dřevěný masážní váleček", detail: "Na krk a ramena", icon: "cylinder", model: "roller" },
          { name: "Deník na 12 týdnů", detail: "S QR meditacemi", icon: "notebookPen", model: "notebook" },
          { name: "Med s kořením", detail: "250 g od včelaře", icon: "hexagon", model: "honey" },
        ],
        muzi: [
          { name: "Prémiový čaj", detail: "V plechovce na doplňování", icon: "coffee", model: "tin" },
          { name: "Sójová svíčka", detail: "180 ml, dřevitá vůně", icon: "flame", model: "candle" },
          { name: "Olej na vousy", detail: "30 ml", icon: "sparkles", model: "dropper" },
          { name: "Masážní válec na záda", detail: "Po dni u stolu", icon: "cylinder", model: "foamRoller" },
          { name: "Deník na 12 týdnů", detail: "S QR meditacemi", icon: "notebookPen", model: "notebook" },
          { name: "Med s kořením", detail: "250 g od včelaře", icon: "hexagon", model: "honey" },
        ],
      },
    },
    {
      id: "ocean",
      name: "Oceán",
      tagline: "Hluboký klid pro ty, kdo táhnou tým",
      description: "Prémiový box pro vedení s keramikou, českým sklem a sezením s koučem.",
      price: 2990,
      items: {
        zeny: [
          { name: "Bio čaj a sklenice", detail: "Sklenice z českého skla", icon: "glassWater", model: "glass" },
          { name: "Svíčka v keramice", detail: "Ručně točená nádoba", icon: "flame", model: "candleCeramic" },
          { name: "Gua sha z českého skla", detail: "Na masáž obličeje", icon: "gem", model: "gem" },
          { name: "Tělový olej", detail: "100 ml, přírodní kosmetika", icon: "droplets", model: "dropper" },
          { name: "Sezení s psychologem", detail: "30 minut online", icon: "messageCircleHeart", model: "voucher" },
          { name: "Plněná čokoláda", detail: "200 g z manufaktury", icon: "cookie", model: "chocolate" },
        ],
        muzi: [
          { name: "Bio čaj a sklenice", detail: "Sklenice z českého skla", icon: "glassWater", model: "glass" },
          { name: "Svíčka v keramice", detail: "Dřevitá vůně", icon: "flame", model: "candleCeramic" },
          { name: "Mini masážní pistole", detail: "Na ztuhlá ramena", icon: "zap", model: "massageGun" },
          { name: "Prémiový olej na vousy", detail: "50 ml", icon: "droplets", model: "dropper" },
          { name: "Sezení s koučem", detail: "30 minut online", icon: "messageCircleHeart", model: "voucher" },
          { name: "Plněná čokoláda", detail: "200 g z manufaktury", icon: "cookie", model: "chocolate" },
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Ukázková data pro režim bez databáze                               */
/*  Demo klient: demo@pauzeo.cz / kód: demo2026                        */
/* ------------------------------------------------------------------ */

export const DEMO_CLIENT_ID = "demo";

export const demoClient = (codeHash: string, codeSalt: string): Client => ({
  id: DEMO_CLIENT_ID,
  company: "Ukázková firma s.r.o.",
  ico: "12345678",
  dic: "CZ12345678",
  street: "Vodičkova 12",
  city: "Praha",
  zip: "110 00",
  contactName: "Jana Nováková",
  email: "demo@pauzeo.cz",
  phone: "+420 777 123 456",
  delivery: "kancelar",
  codeHash,
  codeSalt,
  createdAt: "2026-03-02T09:00:00.000Z",
});

export const demoOrders: Order[] = [
  {
    id: "o-demo-1",
    number: "PZ-2026-004",
    clientId: DEMO_CLIENT_ID,
    edition: "Jarní box 2026",
    createdAt: "2026-03-10T10:00:00.000Z",
    lines: [{ variant: "kapka", zeny: 14, muzi: 12 }],
    total: 26 * 890,
    status: "dorucena",
    note: "",
  },
  {
    id: "o-demo-2",
    number: "PZ-2026-011",
    clientId: DEMO_CLIENT_ID,
    edition: "Letní box 2026",
    createdAt: "2026-06-08T10:00:00.000Z",
    lines: [{ variant: "vlna", zeny: 14, muzi: 12 }],
    total: 26 * 1490,
    status: "dorucena",
    note: "",
  },
  {
    id: "o-demo-3",
    number: "PZ-2026-019",
    clientId: DEMO_CLIENT_ID,
    edition: "Podzimní box 2026",
    createdAt: "2026-09-05T10:00:00.000Z",
    lines: [
      { variant: "vlna", zeny: 15, muzi: 12 },
      { variant: "ocean", zeny: 1, muzi: 2 },
    ],
    total: 27 * 1490 + 3 * 2990,
    status: "baleni",
    note: "Doručit na recepci ve 2. patře.",
  },
];

export const seedLeads: Lead[] = [];
