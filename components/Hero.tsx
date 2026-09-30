import fs from "node:fs";
import path from "node:path";
import { HeroClient } from "@/components/HeroClient";
import type { Catalog } from "@/lib/types";

/**
 * Pokud existuje public/hero.webp (AI obrázek), zobrazí se v úvodu.
 * Jinak se použije animovaný box jako záloha.
 */
export function Hero({ catalog }: { catalog: Catalog }) {
  const hasImage = fs.existsSync(path.join(process.cwd(), "public", "hero.webp"));
  const vlna = catalog.boxes.find((b) => b.id === "vlna") ?? catalog.boxes[0];
  const minPrice = Math.min(...catalog.boxes.map((b) => b.price));
  return <HeroClient hasImage={hasImage} fallback={vlna} minPrice={minPrice} />;
}
