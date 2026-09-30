"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Leaf, Snowflake, Sprout, Sun, type LucideIcon } from "lucide-react";
import type { Edition, SeasonId } from "@/lib/types";

type Season = {
  id: SeasonId;
  name: string;
  theme: string;
  month: string;
  text: string;
  icon: LucideIcon;
  bg: string;
  ink: string;
  accent: string;
  /** jemná smyčková animace ikony */
  loop: Record<string, number[]>;
};

const seasons: Season[] = [
  {
    id: "jaro",
    name: "Jaro",
    theme: "Nabij se",
    month: "Doručení v dubnu",
    text: "Svěží bylinky a energie do nového startu.",
    icon: Sprout,
    bg: "#e3ecd9",
    ink: "#26401f",
    accent: "#5f8a4c",
    loop: { rotate: [-6, 6, -6] },
  },
  {
    id: "leto",
    name: "Léto",
    theme: "Vypni",
    month: "Doručení v červenci",
    text: "Lehké vůně a pohoda na dovolenou.",
    icon: Sun,
    bg: "#f3e7c9",
    ink: "#4a3a12",
    accent: "#c4922c",
    loop: { rotate: [0, 360] },
  },
  {
    id: "podzim",
    name: "Podzim",
    theme: "Zpomal",
    month: "Doručení v říjnu",
    text: "Teplé čaje a klid na dlouhé večery.",
    icon: Leaf,
    bg: "#eedfd0",
    ink: "#4a2e1c",
    accent: "#a9603a",
    loop: { rotate: [-10, 8, -10], y: [0, 4, 0] },
  },
  {
    id: "zima",
    name: "Zima",
    theme: "Zahřej se",
    month: "Doručení v lednu",
    text: "Hřejivé rituály na nejchladnější měsíce.",
    icon: Snowflake,
    bg: "#dce9ec",
    ink: "#16323d",
    accent: "#4f7f92",
    loop: { rotate: [0, 180] },
  },
];

export function Seasons({ current }: { current: Edition }) {
  const reduce = useReducedMotion();

  return (
    <section id="rocni-obdobi" className="py-14 md:py-20">
      <div className="px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.015em]">
              Čtyři boxy za rok
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-hlubina-2">
              Každý zaměstnanec dostane box čtyřikrát ročně. Pokaždé s&nbsp;tématem podle ročního
              období.
            </p>
          </div>
          <p className="inline-flex items-center gap-3 self-start rounded-full bg-white py-2 pl-2 pr-5 font-medium md:self-auto">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-vlna font-display text-lg text-white">
              4×
            </span>
            ročně v každé variantě
          </p>
        </div>
      </div>

      {/* na mobilu vodorovný posuv, na počítači mřížka */}
      <div className="md:px-6">
      <motion.ul
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: reduce ? 0 : 0.1 }}
        className="mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-6 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {seasons.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.li
              key={s.name}
              className="flex w-[78%] shrink-0 snap-center flex-col gap-8 rounded-[36px] p-6 sm:w-[46%] md:w-auto"
              style={{ background: s.bg, color: s.ink }}
              variants={{
                hidden: { opacity: 0, y: 40, rotate: i % 2 ? 2 : -2 },
                show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-white/70"
                  style={{ color: s.accent }}
                >
                  <motion.span
                    className="flex"
                    animate={reduce ? undefined : s.loop}
                    transition={{
                      duration: s.name === "Léto" ? 18 : s.name === "Zima" ? 12 : 4,
                      repeat: Infinity,
                      ease: s.name === "Léto" || s.name === "Zima" ? "linear" : "easeInOut",
                    }}
                  >
                    <Icon size={36} strokeWidth={1.6} aria-hidden="true" />
                  </motion.span>
                </span>
                {current.open && current.season === s.id ? (
                  <span className="rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ background: s.accent }}>
                    Právě v prodeji
                  </span>
                ) : (
                  <span className="font-display text-5xl font-medium opacity-20" aria-hidden="true">
                    {i + 1}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-display text-4xl font-medium leading-none">{s.name}</h3>
                <p className="mt-2 text-lg font-semibold" style={{ color: s.accent }}>
                  {s.theme}
                </p>
                <p className="mt-3 leading-relaxed">{s.text}</p>
                <p className="mt-5 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold">{s.month}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
      </div>
    </section>
  );
}
