"use client";

import { useEffect, useState } from "react";
import { Package, Tag, Users } from "lucide-react";
import { BoxScene } from "@/components/BoxScene";
import { boxes } from "@/data/boxes";

const facts = [
  { icon: Package, text: "3 varianty boxu" },
  { icon: Users, text: "Pánská i dámská náplň" },
  { icon: Tag, text: "Od 890 Kč za box" },
];

export function Hero() {
  const [open, setOpen] = useState(false);
  const vlna = boxes[1];

  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-6">
        <div>
          <h1 className="font-display text-[clamp(3.4rem,9vw,6.6rem)] font-medium leading-[0.95] tracking-[-0.02em] text-hlubina">
            Dejte týmu pauzu.
          </h1>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-hlubina-2 sm:text-xl">
            Každé čtvrtletí jeden box se šesti věcmi od českých manufaktur. Pro klid, péči
            a&nbsp;pohyb. Doručíme ho každému domů nebo do kanceláře.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#boxy"
              className="inline-flex items-center rounded-full bg-hlubina px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-vlna"
            >
              Vybrat box
            </a>
            <a
              href="#poptavka"
              className="inline-flex items-center rounded-full border-2 border-hlubina/15 bg-white px-7 py-4 text-base font-semibold text-hlubina transition-colors hover:border-hlubina/40"
            >
              Objednat ukázku
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2.5">
            {facts.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="inline-flex items-center gap-2.5 rounded-full bg-white/70 py-2 pl-2 pr-4 text-[15px] font-medium text-hlubina"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mlha-2 text-vlna">
                  <Icon size={16} strokeWidth={2} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[520px]">
          <BoxScene variant={vlna} items={vlna.items.zeny} open={open} contentKey="hero" halo="#d3e3e0" />
        </div>
      </div>
    </section>
  );
}
