import { iconLabels, modelLabels } from "@/lib/labels";
import type { BoxData, Catalog, Edition, IconKey, ItemData, ModelKey, SeasonId, VariantId } from "@/lib/types";

const str = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);
const VARIANTS: VariantId[] = ["kapka", "vlna", "ocean"];
const SEASONS: SeasonId[] = ["jaro", "leto", "podzim", "zima"];

function item(raw: unknown, fallback: ItemData): ItemData {
  const r = (raw ?? {}) as Partial<ItemData>;
  const icon = (r.icon && r.icon in iconLabels ? r.icon : fallback.icon) as IconKey;
  const model = (r.model && r.model in modelLabels ? r.model : fallback.model) as ModelKey;
  return { name: str(r.name, 80) || fallback.name, detail: str(r.detail, 80), icon, model };
}

function box(raw: unknown, fallback: BoxData): BoxData {
  const r = (raw ?? {}) as Partial<BoxData>;
  const price = Math.round(Number(r.price));
  return {
    id: fallback.id,
    name: str(r.name, 40) || fallback.name,
    tagline: str(r.tagline, 80),
    description: str(r.description, 240),
    price: Number.isFinite(price) && price > 0 ? price : fallback.price,
    items: {
      zeny: fallback.items.zeny.map((f, i) => item(r.items?.zeny?.[i], f)),
      muzi: fallback.items.muzi.map((f, i) => item(r.items?.muzi?.[i], f)),
    },
  };
}

export function edition(raw: unknown, fallback: Edition): Edition {
  const r = (raw ?? {}) as Partial<Edition>;
  const year = Math.round(Number(r.year));
  const deadline = /^\d{4}-\d{2}-\d{2}$/.test(String(r.deadline)) ? String(r.deadline) : fallback.deadline;
  return {
    season: SEASONS.includes(r.season as SeasonId) ? (r.season as SeasonId) : fallback.season,
    year: year >= 2024 && year <= 2100 ? year : fallback.year,
    deadline,
    delivery: str(r.delivery, 60) || fallback.delivery,
    open: Boolean(r.open),
  };
}

export function catalog(raw: unknown, current: Catalog): Catalog {
  const r = (raw ?? {}) as Partial<Catalog>;
  return {
    boxes: VARIANTS.map((id) => {
      const fb = current.boxes.find((b) => b.id === id)!;
      return box(r.boxes?.find((b) => b?.id === id), fb);
    }),
    edition: edition(r.edition, current.edition),
    updatedAt: new Date().toISOString(),
  };
}

export const clean = str;
