"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HandHeart, Package, Tag, Truck, Users } from "lucide-react";
import { BoxScene } from "@/components/BoxScene";
import { boxes } from "@/data/boxes";

const facts = [
  { icon: Package, text: "3 varianty" },
  { icon: Users, text: "Pánská i dámská náplň" },
  { icon: Tag, text: "Od 890 Kč za box" },
];

const floating = [
  { icon: HandHeart, text: "Ručně balené v Česku", pos: "left-[-2%] top-[6%] sm:left-[-6%]", delay: 0 },
  { icon: Truck, text: "Domů i do kanceláře", pos: "right-[-2%] bottom-[3%] sm:right-[-4%]", delay: 1.2 },
];

export function HeroClient({ hasImage }: { hasImage: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const vlna = boxes[1];

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.94]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 md:pb-20 md:pt-14">
      {/* měkké kulaté tvary v pozadí */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-mlha-2" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-white/60" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-6">
        <motion.div style={{ y: textY }}>
          <h1 className="font-display text-[clamp(3.4rem,9vw,6.6rem)] font-medium leading-[0.95] tracking-[-0.02em] text-hlubina">
            Dejte týmu pauzu.
          </h1>
          <p className="mt-6 max-w-[32ch] text-lg leading-relaxed text-hlubina-2 sm:text-xl">
            Každé čtvrtletí box se šesti věcmi od českých manufaktur. Doručíme ho každému domů
            i&nbsp;do kanceláře.
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
                className="inline-flex items-center gap-2.5 rounded-full bg-white/80 py-2 pl-2 pr-4 text-[15px] font-medium text-hlubina"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mlha-2 text-vlna">
                  <Icon size={16} strokeWidth={2} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div style={{ y: visualY, scale: visualScale }} className="relative mx-auto w-full max-w-[520px]">
          {hasImage ? (
            <Image
              src="/hero.webp"
              alt="Otevřený box Pauzeo s čajem, svíčkou a dalšími věcmi od českých manufaktur"
              width={1024}
              height={1024}
              priority
              sizes="(min-width: 768px) 520px, 92vw"
              className="aspect-square w-full rounded-[48px] object-cover shadow-[0_30px_80px_rgba(15,42,54,0.18)]"
            />
          ) : (
            <BoxScene variant={vlna} items={vlna.items.zeny} open={open} contentKey="hero" halo="#d3e3e0" />
          )}

          {floating.map(({ icon: Icon, text, pos, delay }) => (
            <motion.div
              key={text}
              aria-hidden="true"
              className={`absolute ${pos} z-10 hidden items-center gap-2.5 rounded-full bg-white py-2 pl-2 pr-4 text-sm font-semibold text-hlubina shadow-[0_12px_30px_rgba(15,42,54,0.12)] sm:inline-flex`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      opacity: { delay: 1.4 + delay * 0.3, duration: 0.4 },
                      scale: { delay: 1.4 + delay * 0.3, duration: 0.4 },
                      y: { delay: 2 + delay, duration: 4, repeat: Infinity, ease: "easeInOut" },
                    }
              }
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-vlna text-white">
                <Icon size={16} strokeWidth={2} />
              </span>
              {text}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
