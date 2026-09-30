"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CalendarClock, Leaf, Snowflake, Sprout, Sun, Truck } from "lucide-react";
import { editionLabel, formatDate, seasonLabels } from "@/lib/labels";
import type { Edition, SeasonId } from "@/lib/types";

const EditionScene = dynamic(() => import("@/components/EditionScene"), { ssr: false });

const palette: Record<SeasonId, { bg: string; ink: string; muted: string; accent: string; onAccent: string; chip: string; icon: typeof Sun }> = {
  zima: { bg: "#1c3a47", ink: "#f2f6f7", muted: "#c9dbe1", accent: "#a9d3e0", onAccent: "#12303b", chip: "rgba(255,255,255,0.1)", icon: Snowflake },
  jaro: { bg: "#e3ecd9", ink: "#26401f", muted: "#45603b", accent: "#5f8a4c", onAccent: "#ffffff", chip: "rgba(255,255,255,0.6)", icon: Sprout },
  leto: { bg: "#f3e7c9", ink: "#4a3a12", muted: "#6a5626", accent: "#2e6b6f", onAccent: "#ffffff", chip: "rgba(255,255,255,0.6)", icon: Sun },
  podzim: { bg: "#eedfd0", ink: "#4a2e1c", muted: "#6b4a34", accent: "#a9603a", onAccent: "#ffffff", chip: "rgba(255,255,255,0.6)", icon: Leaf },
};

/** Zbývající čas do konce dne uzávěrky. */
function useCountdown(deadline: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number } | null>(null);
  useEffect(() => {
    const end = new Date(`${deadline}T23:59:59`).getTime();
    const tick = () => {
      const ms = Math.max(0, end - Date.now());
      setLeft({ d: Math.floor(ms / 86400000), h: Math.floor((ms / 3600000) % 24), m: Math.floor((ms / 60000) % 60) });
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, [deadline]);
  return left;
}

const plural = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);

export function EditionBanner({ edition }: { edition: Edition }) {
  const p = palette[edition.season];
  const Icon = p.icon;
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.1 });
  const reduce = !!useReducedMotion();
  const left = useCountdown(edition.deadline);
  const expired = left !== null && left.d + left.h + left.m === 0;
  const open = edition.open && !expired;

  const units = left
    ? [
        { v: left.d, l: plural(left.d, "den", "dny", "dní") },
        { v: left.h, l: plural(left.h, "hodina", "hodiny", "hodin") },
        { v: left.m, l: plural(left.m, "minuta", "minuty", "minut") },
      ]
    : [];

  return (
    <motion.div
      ref={ref}
      className="relative mt-8 grid overflow-hidden rounded-[36px] md:grid-cols-[1fr_1.15fr] md:rounded-[44px]"
      style={{ background: p.bg, color: p.ink }}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 3D scéna s ročním obdobím */}
      <div className="relative h-56 sm:h-64 md:h-auto md:min-h-[300px]" aria-hidden="true">
        <EditionScene
          season={edition.season}
          active={visible}
          reduce={reduce}
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-28 w-28 items-center justify-center rounded-full" style={{ background: p.chip }}>
                <Icon size={52} strokeWidth={1.5} />
              </span>
            </div>
          }
        />
      </div>

      <div className="relative flex flex-col justify-center gap-5 p-6 pt-0 sm:p-8 sm:pt-0 md:p-10 md:pl-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold" style={{ background: p.chip }}>
            <span className="relative flex h-2.5 w-2.5">
              {open && !reduce && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: p.accent }} />
              )}
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: open ? p.accent : p.muted }} />
            </span>
            {open ? "Právě objednáváte" : "Objednávky jsou uzavřené"}
          </p>
          <h3 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.015em]">
            {editionLabel(edition)}
          </h3>
          <p className="mt-1 text-lg font-medium" style={{ color: p.muted }}>
            {seasonLabels[edition.season].theme}
          </p>
        </div>

        {open && (
          <div>
            <p className="mb-2 text-sm font-semibold" style={{ color: p.muted }}>
              Do uzávěrky zbývá
            </p>
            <ul className="flex gap-2" aria-live="off">
              {(left ? units : [{ v: 0, l: "dní" }, { v: 0, l: "hodin" }, { v: 0, l: "minut" }]).map((u, i) => (
                <li
                  key={i}
                  className="flex min-w-[76px] flex-col items-center rounded-[22px] px-3 py-2.5"
                  style={{ background: p.chip }}
                >
                  <motion.span
                    key={`${u.v}`}
                    className="font-display text-3xl font-medium leading-none tabular-nums"
                    initial={reduce || !left ? false : { y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: left ? 1 : 0.3 }}
                    transition={{ duration: 0.3 }}
                  >
                    {u.v}
                  </motion.span>
                  <span className="mt-1 text-xs font-semibold" style={{ color: p.muted }}>
                    {u.l}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="flex flex-col gap-1.5 text-[15px]" style={{ color: p.muted }}>
          <li className="flex items-center gap-2">
            <CalendarClock size={17} aria-hidden="true" className="shrink-0" />
            Uzávěrka {formatDate(edition.deadline)}
          </li>
          <li className="flex items-center gap-2">
            <Truck size={17} aria-hidden="true" className="shrink-0" />
            Doručení: {edition.delivery}
          </li>
        </ul>

        <div className="flex flex-wrap gap-2.5">
          <a
            href="#poptavka"
            className="inline-flex items-center rounded-full px-6 py-3.5 font-semibold transition-transform active:scale-[0.97]"
            style={{ background: p.accent, color: p.onAccent }}
          >
            {open ? "Chci objednat" : "Dejte mi vědět o další edici"}
          </a>
          <a
            href="/klient"
            className="inline-flex items-center rounded-full px-6 py-3.5 font-semibold"
            style={{ background: p.chip, color: p.ink }}
          >
            Mám účet
          </a>
        </div>
      </div>
    </motion.div>
  );
}
