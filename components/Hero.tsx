import fs from "node:fs";
import path from "node:path";
import { HeroClient } from "@/components/HeroClient";

/**
 * Pokud existuje public/hero.webp (AI obrázek), zobrazí se v úvodu.
 * Jinak se použije animovaný box jako záloha.
 */
export function Hero() {
  const hasImage = fs.existsSync(path.join(process.cwd(), "public", "hero.webp"));
  return <HeroClient hasImage={hasImage} />;
}
