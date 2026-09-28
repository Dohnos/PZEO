"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { CalendarCheck, Gift, PackageCheck, Truck } from "lucide-react";

const steps = [
  { icon: Gift, title: "Vyberete box", text: "Kapku, Vlnu nebo Oceán a počet lidí." },
  { icon: CalendarCheck, title: "Potvrdíte počty", text: "Do uzávěrky, fakturu platíte na čtvrtletí." },
  { icon: PackageCheck, title: "Ručně zabalíme", text: "Věci objednáme u českých manufaktur." },
  { icon: Truck, title: "Doručíme", text: "Do kanceláře, nebo každému domů." },
];

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [reached, setReached] = useState(reduce ? steps.length : 0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    // krok se „rozsvítí“, když k němu dojede čára
    const n = steps.filter((_, i) => v >= i / (steps.length - 1) - 0.02).length;
    setReached(n);
  });

  return (
    <section id="jak-to-funguje" className="px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.015em]">
          Jak to funguje
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-hlubina-2">
          Předplatné na rok. Platíte vždy jen čtvrtletí dopředu.
        </p>

        <ol ref={ref} className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* podkladová čára */}
          <div
            aria-hidden="true"
            className="absolute left-[31px] top-2 bottom-2 w-1 rounded-full bg-hlubina/10 md:left-[12.5%] md:right-[12.5%] md:top-[30px] md:bottom-auto md:h-1 md:w-auto"
          />
          {/* čára kreslená scrollem – mobil (svisle) */}
          <motion.div
            aria-hidden="true"
            className="absolute left-[31px] top-2 bottom-2 w-1 origin-top rounded-full bg-vlna md:hidden"
            style={{ scaleY: reduce ? 1 : progress }}
          />
          {/* čára kreslená scrollem – desktop (vodorovně) */}
          <motion.div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-[30px] hidden h-1 origin-left rounded-full bg-vlna md:block"
            style={{ scaleX: reduce ? 1 : progress }}
          />

          {steps.map(({ icon: Icon, title, text }, i) => {
            const on = i < reached;
            return (
              <li key={title} className="relative flex items-start gap-5 md:flex-col md:items-center md:text-center">
                <motion.span
                  className="relative z-[1] flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                  animate={{
                    backgroundColor: on ? "#2e6b6f" : "#ffffff",
                    color: on ? "#ffffff" : "#3f5a63",
                    scale: on ? 1 : 0.9,
                  }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                  style={{ boxShadow: "0 0 0 8px var(--color-mlha)" }}
                >
                  <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                </motion.span>
                <div className="pt-2 md:pt-0">
                  <p className="text-sm font-semibold text-vlna">Krok {i + 1}</p>
                  <h3 className="mt-1 text-xl font-semibold leading-snug">{title}</h3>
                  <p className="mt-1.5 leading-relaxed text-hlubina-2">{text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
