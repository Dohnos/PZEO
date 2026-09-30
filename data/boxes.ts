import type { LucideIcon } from "lucide-react";
import { icons } from "@/lib/icons";
import type { BoxData, Gender, ModelKey, VariantId } from "@/lib/types";

export type { Gender, VariantId } from "@/lib/types";
export { formatPrice } from "@/lib/labels";

export type BoxItem = {
  name: string;
  detail: string;
  icon: LucideIcon;
  model: ModelKey;
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

/** Barvy variant jsou součástí designu, v administraci se nemění. */
export const themes: Record<VariantId, BoxTheme> = {
  kapka: {
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
  vlna: {
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
  ocean: {
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
};

/** Z dat (z administrace) udělá varianty pro zobrazení: doplní barvy a ikony. */
export function toVariants(data: BoxData[]): BoxVariant[] {
  return data.map((b) => ({
    ...b,
    theme: themes[b.id],
    items: {
      zeny: b.items.zeny.map((i) => ({ ...i, icon: icons[i.icon] })),
      muzi: b.items.muzi.map((i) => ({ ...i, icon: icons[i.icon] })),
    },
  }));
}
