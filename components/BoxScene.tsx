"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { BoxItem, BoxVariant } from "@/data/boxes";

/** Pozice šesti předmětů na oblouku nad boxem (v % scény). */
const ARC = [162, 133.2, 104.4, 75.6, 46.8, 18].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: 50 + 40 * Math.cos(rad), y: 59 - 38 * Math.sin(rad) };
});

type Props = {
  variant: BoxVariant;
  items: BoxItem[];
  open: boolean;
  /** klíč, při jehož změně se předměty znovu „vysypou“ */
  contentKey: string;
  highlighted?: number | null;
  /** volitelná barva kruhu v pozadí (např. světlejší v úvodu stránky) */
  halo?: string;
};

export function BoxScene({ variant, items, open, contentKey, highlighted = null, halo }: Props) {
  const reduce = useReducedMotion();
  const t = variant.theme;

  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 220, damping: 20 };

  return (
    <div
      className="relative aspect-square w-full select-none"
      style={{ containerType: "inline-size" }}
      aria-hidden="true"
    >
      {/* měkký kruh v pozadí */}
      <motion.div
        className="absolute inset-[7%] rounded-full"
        animate={{ backgroundColor: halo ?? t.halo }}
        transition={{ duration: reduce ? 0 : 0.6 }}
      />

      {/* předměty */}
      {items.map((item, i) => {
        const Icon = item.icon;
        const p = ARC[i];
        const isHi = highlighted === i;
        return (
          <motion.div
            key={`${contentKey}-${i}`}
            className="absolute z-[1] flex items-center justify-center rounded-full"
            style={{
              width: "15.5%",
              height: "15.5%",
              x: "-50%",
              y: "-50%",
              background: t.badgeBg,
              color: t.badgeInk,
              boxShadow: `0 1.4cqw 3cqw rgba(0,0,0,0.16), inset 0 0 0 1px ${t.border}`,
            }}
            initial={{ left: "50%", top: "74%", scale: 0.3, opacity: 0 }}
            animate={
              open
                ? { left: `${p.x}%`, top: `${p.y}%`, scale: isHi ? 1.14 : 1, opacity: 1 }
                : { left: "50%", top: "74%", scale: 0.3, opacity: 0 }
            }
            transition={{
              ...spring,
              delay: reduce ? 0 : open ? 0.22 + i * 0.07 : (items.length - i) * 0.03,
            }}
          >
            <Icon className="h-[46%] w-[46%]" strokeWidth={1.75} />
          </motion.div>
        );
      })}

      {/* tělo boxu */}
      <motion.div
        className="absolute left-[18%] top-[60%] z-[2] flex h-[32%] w-[64%] flex-col items-center justify-center gap-[4%] rounded-[7cqw]"
        animate={{ backgroundColor: t.boxBody }}
        transition={{ duration: reduce ? 0 : 0.6 }}
        style={{
          boxShadow: `0 3cqw 6cqw rgba(0,0,0,0.18), inset 0 0 0 0.35cqw ${t.boxStroke}`,
        }}
      >
        <Motif variant={variant} />
        <span
          className="font-display uppercase leading-none tracking-[0.16em]"
          style={{ color: t.motif, fontSize: "3.8cqw", fontVariationSettings: '"SOFT" 0, "opsz" 72' }}
        >
          Pauzeo
        </span>
      </motion.div>

      {/* víko */}
      <motion.div
        className="absolute left-[15%] z-[3] h-[10%] w-[70%] rounded-[6cqw]"
        style={{
          boxShadow: `0 2cqw 4cqw rgba(0,0,0,0.16), inset 0 0 0 0.35cqw ${t.boxStroke}`,
        }}
        initial={false}
        animate={{
          top: open ? "-1%" : "54%",
          rotate: open ? -5 : 0,
          backgroundColor: t.boxLid,
        }}
        transition={{ ...spring, backgroundColor: { duration: reduce ? 0 : 0.6 } }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[18%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: t.motif, opacity: 0.55 }}
        />
      </motion.div>
    </div>
  );
}

export function Motif({ variant, className }: { variant: BoxVariant; className?: string }) {
  const c = variant.theme.motif;
  const common = { fill: "none", stroke: c, strokeLinecap: "round" as const };

  if (variant.id === "kapka") {
    return (
      <svg viewBox="0 0 40 50" className={className ?? "h-[36%]"}>
        <path d="M20 3C20 3 5 22 5 33a15 15 0 0 0 30 0C35 22 20 3 20 3Z" {...common} strokeWidth={2.2} />
        <path d="M20 21c0 0-7 9-7 14a7 7 0 0 0 14 0c0-5-7-14-7-14Z" fill={c} />
      </svg>
    );
  }

  if (variant.id === "vlna") {
    return (
      <svg viewBox="0 0 120 44" className={className ?? "h-[30%]"}>
        <path d="M4 10C19 2 34 2 49 10s30 8 45 0 18-6 22-3" {...common} strokeWidth={2.4} opacity={0.7} />
        <path d="M4 22C19 14 34 14 49 22s30 8 45 0 18-6 22-3" {...common} strokeWidth={3.2} />
        <path d="M4 34C19 26 34 26 49 34s30 8 45 0 18-6 22-3" {...common} strokeWidth={2.4} opacity={0.7} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 60" className={className ?? "h-[36%]"}>
      <circle cx="60" cy="22" r="14" {...common} strokeWidth={1.8} />
      <path d="M10 40h100" {...common} strokeWidth={1.8} />
      <path d="M22 48c12-4 24-4 36 0s24 4 40 0" {...common} strokeWidth={1.4} />
      <path d="M34 55c10-3 20-3 30 0s16 3 22 0" {...common} strokeWidth={1.1} />
    </svg>
  );
}
