"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

const numbers = [
  { value: 6, label: "věcí v každém boxu", color: "#6f9bad" },
  { value: 4, label: "boxy za rok", color: "#2e6b6f" },
  { value: 10, label: "boxů je minimum na objednávku", color: "#c9a45c" },
];

function Ring({ value, label, color, start, index }: (typeof numbers)[number] & { start: boolean; index: number }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!start || reduce) return;
    const controls = animate(0, value, {
      duration: 1.1,
      delay: index * 0.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [start, reduce, value, index]);

  return (
    <li className="flex items-center gap-5 md:flex-col md:gap-4 md:text-center">
      <span className="relative flex h-28 w-28 shrink-0 items-center justify-center md:h-36 md:w-36">
        <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(15,42,54,0.08)" strokeWidth="10" />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: start || reduce ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : index * 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="font-display text-5xl font-medium md:text-6xl" aria-hidden="true">
          {shown}
        </span>
      </span>
      <span className="text-lg font-medium leading-snug text-hlubina-2">
        <span className="sr-only">{value} </span>
        {label}
      </span>
    </li>
  );
}

export function Numbers() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section aria-label="Předplatné v číslech" className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-[40px] bg-white px-6 py-8 sm:px-10 md:py-12">
        <ul ref={ref} className="grid gap-6 md:grid-cols-3 md:gap-8">
          {numbers.map((n, i) => (
            <Ring key={n.label} {...n} start={inView} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
