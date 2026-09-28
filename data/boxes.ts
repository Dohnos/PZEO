import type { LucideIcon } from "lucide-react";
import {
  Coffee,
  Cookie,
  CircleDot,
  Cylinder,
  Droplet,
  Droplets,
  Flame,
  Gem,
  GlassWater,
  Hexagon,
  MessageCircleHeart,
  NotebookPen,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react";

export type VariantId = "kapka" | "vlna" | "ocean";
export type Gender = "zeny" | "muzi";

export type BoxItem = {
  name: string;
  detail: string;
  icon: LucideIcon;
};

export type BoxTheme = {
  /** pozadí panelu varianty */
  surface: string;
  /** měkký kruh za boxem */
  halo: string;
  ink: string;
  muted: string;
  accent: string;
  onAccent: string;
  boxBody: string;
  boxLid: string;
  boxStroke: string;
  motif: string;
  badgeBg: string;
  badgeInk: string;
  rowBg: string;
  border: string;
};

export type BoxVariant = {
  id: VariantId;
  name: string;
  tagline: string;
  description: string;
  price: number;
  theme: BoxTheme;
  items: Record<Gender, BoxItem[]>;
};

export const boxes: BoxVariant[] = [
  {
    id: "kapka",
    name: "Kapka",
    tagline: "Malá pauza pro každý den",
    description:
      "Šest drobností do běžného dne pro celý tým.",
    price: 890,
    theme: {
      surface: "#dce9ec",
      halo: "#c9dde2",
      ink: "#16323d",
      muted: "#3f5a63",
      accent: "#2f5f70",
      onAccent: "#ffffff",
      boxBody: "#d9c8a9",
      boxLid: "#e8dbc4",
      boxStroke: "rgba(22, 50, 61, 0.08)",
      motif: "#5d8ea1",
      badgeBg: "#ffffff",
      badgeInk: "#2f5f70",
      rowBg: "rgba(255, 255, 255, 0.62)",
      border: "rgba(22, 50, 61, 0.12)",
    },
    items: {
      zeny: [
        { name: "Relaxační bylinný čaj", detail: "Sypaný, 50 g", icon: Coffee },
        { name: "Sójová svíčka", detail: "60 ml, květinová vůně", icon: Flame },
        { name: "Krém na ruce", detail: "Přírodní kosmetika", icon: Droplet },
        { name: "Masážní míček", detail: "Na záda i chodidla", icon: CircleDot },
        { name: "Karta s dechovým cvičením", detail: "S QR kódem na audio", icon: Wind },
        { name: "Čokoláda z manufaktury", detail: "95 g", icon: Cookie },
      ],
      muzi: [
        { name: "Zázvorový čaj", detail: "Sypaný, 50 g", icon: Coffee },
        { name: "Sójová svíčka", detail: "60 ml, cedr a borovice", icon: Flame },
        { name: "Univerzální balzám", detail: "Na ruce i obličej", icon: Droplet },
        { name: "Masážní míček", detail: "Na záda i chodidla", icon: CircleDot },
        { name: "Karta s dechovým cvičením", detail: "S QR kódem na audio", icon: Wind },
        { name: "Hořká čokoláda", detail: "95 g z manufaktury", icon: Cookie },
      ],
    },
  },
  {
    id: "vlna",
    name: "Vlna",
    tagline: "Pauza, která tě ponese",
    description:
      "Nejčastější volba pro pravidelný benefit, s deníkem na celé čtvrtletí.",
    price: 1490,
    theme: {
      surface: "#2e6b6f",
      halo: "#377a7e",
      ink: "#f6f1e7",
      muted: "#dce7e3",
      accent: "#e8d6ac",
      onAccent: "#173c3f",
      boxBody: "#1f5053",
      boxLid: "#3f878b",
      boxStroke: "rgba(246, 241, 231, 0.16)",
      motif: "#e8d6ac",
      badgeBg: "#f6f1e7",
      badgeInk: "#2e6b6f",
      rowBg: "rgba(255, 255, 255, 0.08)",
      border: "rgba(246, 241, 231, 0.2)",
    },
    items: {
      zeny: [
        { name: "Prémiový čaj", detail: "V plechovce na doplňování", icon: Coffee },
        { name: "Sójová svíčka", detail: "180 ml, meduňka", icon: Flame },
        { name: "Aroma balzám proti stresu", detail: "S esenciálními oleji", icon: Sparkles },
        { name: "Dřevěný masážní váleček", detail: "Na krk a ramena", icon: Cylinder },
        { name: "Deník na 12 týdnů", detail: "S QR meditacemi", icon: NotebookPen },
        { name: "Med s kořením", detail: "250 g od včelaře", icon: Hexagon },
      ],
      muzi: [
        { name: "Prémiový čaj", detail: "V plechovce na doplňování", icon: Coffee },
        { name: "Sójová svíčka", detail: "180 ml, dřevitá vůně", icon: Flame },
        { name: "Olej na vousy", detail: "30 ml", icon: Sparkles },
        { name: "Masážní válec na záda", detail: "Po dni u stolu", icon: Cylinder },
        { name: "Deník na 12 týdnů", detail: "S QR meditacemi", icon: NotebookPen },
        { name: "Med s kořením", detail: "250 g od včelaře", icon: Hexagon },
      ],
    },
  },
  {
    id: "ocean",
    name: "Oceán",
    tagline: "Hluboký klid pro ty, kdo táhnou tým",
    description:
      "Prémiový box pro vedení s keramikou, českým sklem a sezením s koučem.",
    price: 2990,
    theme: {
      surface: "#10222f",
      halo: "#172f3f",
      ink: "#f1eadb",
      muted: "#cfc6b4",
      accent: "#c9a45c",
      onAccent: "#10222f",
      boxBody: "#0a1822",
      boxLid: "#1b3547",
      boxStroke: "rgba(201, 164, 92, 0.55)",
      motif: "#c9a45c",
      badgeBg: "#1b3547",
      badgeInk: "#e0be78",
      rowBg: "rgba(255, 255, 255, 0.05)",
      border: "rgba(201, 164, 92, 0.28)",
    },
    items: {
      zeny: [
        { name: "Bio čaj a sklenice", detail: "Sklenice z českého skla", icon: GlassWater },
        { name: "Svíčka v keramice", detail: "Ručně točená nádoba", icon: Flame },
        { name: "Gua sha z českého skla", detail: "Na masáž obličeje", icon: Gem },
        { name: "Tělový olej", detail: "100 ml, přírodní kosmetika", icon: Droplets },
        { name: "Sezení s psychologem", detail: "30 minut online", icon: MessageCircleHeart },
        { name: "Plněná čokoláda", detail: "200 g z manufaktury", icon: Cookie },
      ],
      muzi: [
        { name: "Bio čaj a sklenice", detail: "Sklenice z českého skla", icon: GlassWater },
        { name: "Svíčka v keramice", detail: "Dřevitá vůně", icon: Flame },
        { name: "Mini masážní pistole", detail: "Na ztuhlá ramena", icon: Zap },
        { name: "Prémiový olej na vousy", detail: "50 ml", icon: Droplets },
        { name: "Sezení s koučem", detail: "30 minut online", icon: MessageCircleHeart },
        { name: "Plněná čokoláda", detail: "200 g z manufaktury", icon: Cookie },
      ],
    },
  },
];

export const formatPrice = (value: number) =>
  `${new Intl.NumberFormat("cs-CZ").format(value)} Kč`;
