import type { Edition, IconKey, ModelKey, OrderStatus, SeasonId } from "@/lib/types";

export const seasonLabels: Record<SeasonId, { name: string; box: string; theme: string }> = {
  jaro: { name: "Jaro", box: "Jarní box", theme: "Nabij se" },
  leto: { name: "Léto", box: "Letní box", theme: "Vypni" },
  podzim: { name: "Podzim", box: "Podzimní box", theme: "Zpomal" },
  zima: { name: "Zima", box: "Zimní box", theme: "Zahřej se" },
};

export const editionLabel = (e: Edition) => `${seasonLabels[e.season].box} ${e.year}`;

export const formatDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "long", year: "numeric" }).format(d);
};

export const formatPrice = (value: number) => `${new Intl.NumberFormat("cs-CZ").format(value)} Kč`;

export const orderStatusLabels: Record<OrderStatus, string> = {
  nova: "Nová",
  potvrzena: "Potvrzená",
  zaplacena: "Zaplacená",
  baleni: "Balíme",
  odeslana: "Odeslaná",
  dorucena: "Doručená",
  zrusena: "Zrušená",
};

/** Pořadí stavů pro ukazatel průběhu (bez „zrušena“). */
export const orderFlow: OrderStatus[] = ["nova", "potvrzena", "zaplacena", "baleni", "odeslana", "dorucena"];

export const iconLabels: Record<IconKey, string> = {
  coffee: "Hrnek (čaj)",
  flame: "Plamen (svíčka)",
  droplet: "Kapka (péče)",
  droplets: "Kapky (olej)",
  circleDot: "Míček",
  cylinder: "Váleček",
  sparkles: "Jiskry (aroma)",
  notebookPen: "Deník",
  hexagon: "Plástev (med)",
  glassWater: "Sklenice",
  gem: "Drahokam (gua sha)",
  messageCircleHeart: "Rozhovor (kouč)",
  zap: "Blesk (masážní pistole)",
  cookie: "Sušenka (mlsání)",
  wind: "Dech (karta)",
  leaf: "List",
  gift: "Dárek",
};

export const modelLabels: Record<ModelKey, string> = {
  tin: "Plechovka na čaj",
  candle: "Svíčka ve skle",
  candleCeramic: "Svíčka v keramice",
  tube: "Tuba s krémem",
  bottle: "Lahvička (roll-on)",
  dropper: "Lahvička s kapátkem",
  balm: "Kelímek s balzámem",
  ball: "Masážní míček",
  roller: "Masážní váleček",
  foamRoller: "Masážní válec",
  massageGun: "Masážní pistole",
  gem: "Gua sha",
  card: "Karta",
  voucher: "Voucher",
  notebook: "Deník",
  honey: "Med ve sklenici",
  glass: "Sklenice",
  chocolate: "Čokoláda",
};
