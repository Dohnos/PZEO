"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PackageOpen, Package } from "lucide-react";
import { BoxScene } from "@/components/BoxScene";
import { boxes, formatPrice, type Gender, type VariantId } from "@/data/boxes";

const accusative: Record<VariantId, string> = {
  kapka: "Kapku",
  vlna: "Vlnu",
  ocean: "Oceán",
};

const genders: { id: Gender; label: string }[] = [
  { id: "zeny", label: "Dámská náplň" },
  { id: "muzi", label: "Pánská náplň" },
];

export function Variants() {
  const [active, setActive] = useState(0);
  const [gender, setGender] = useState<Gender>("zeny");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState<number | null>(null);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();

  const variant = boxes[active];
  const t = variant.theme;
  const items = variant.items[gender];
  const contentKey = `${variant.id}-${gender}`;

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + boxes.length) % boxes.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  const pickForForm = () => {
    window.dispatchEvent(new CustomEvent("pauzeo:varianta", { detail: variant.id }));
  };

  return (
    <section id="boxy" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.015em]">
              Tři boxy. Stejná cena pro muže i&nbsp;ženy.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-hlubina-2">
              Vyberte variantu a otevřete box. Uvidíte všech šest věcí, které v&nbsp;něm
              zaměstnanci najdou.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Varianty boxu"
            className="inline-flex self-start rounded-full bg-white p-1.5 shadow-[0_6px_24px_rgba(15,42,54,0.06)] md:self-auto"
          >
            {boxes.map((b, i) => {
              const selected = i === active;
              return (
                <button
                  key={b.id}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${b.id}`}
                  aria-selected={selected}
                  aria-controls="panel-boxu"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className="relative rounded-full px-4 py-2.5 text-left sm:px-6 sm:py-3"
                >
                  {selected && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: b.theme.surface }}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className="relative block text-[15px] font-semibold sm:text-base"
                    style={{ color: selected ? b.theme.ink : "#0f2a36" }}
                  >
                    {b.name}
                  </span>
                  <span
                    className="relative block text-xs sm:text-[13px]"
                    style={{ color: selected ? b.theme.muted : "#3f5a63" }}
                  >
                    {formatPrice(b.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          id="panel-boxu"
          role="tabpanel"
          aria-labelledby={`tab-${variant.id}`}
          className="mt-8 rounded-[36px] p-5 sm:rounded-[44px] sm:p-8 md:p-12"
          animate={{ backgroundColor: t.surface, color: t.ink }}
          transition={{ duration: reduce ? 0 : 0.5 }}
        >
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col items-center gap-5">
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => setOpen((v) => !v)}
                className="w-full max-w-[480px] cursor-pointer rounded-full"
              >
                <BoxScene
                  variant={variant}
                  items={items}
                  open={open}
                  contentKey={contentKey}
                  highlighted={hi}
                />
              </button>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-base font-semibold transition-transform active:scale-[0.97]"
                style={{ background: t.accent, color: t.onAccent }}
              >
                {open ? <Package size={20} /> : <PackageOpen size={20} />}
                {open ? "Zavřít box" : "Otevřít box"}
              </button>
            </div>

            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={variant.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="font-display text-[clamp(2.8rem,6vw,4.4rem)] font-medium leading-none tracking-[-0.02em]">
                    {variant.name}
                  </h3>
                  <p className="mt-3 text-lg font-medium" style={{ color: t.muted }}>
                    {variant.tagline}
                  </p>
                  <p className="mt-4 max-w-[52ch] leading-relaxed" style={{ color: t.muted }}>
                    {variant.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div
                className="mt-7 inline-flex rounded-full p-1"
                style={{ background: t.rowBg, boxShadow: `inset 0 0 0 1px ${t.border}` }}
                role="group"
                aria-label="Náplň boxu"
              >
                {genders.map((g) => {
                  const sel = g.id === gender;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      aria-pressed={sel}
                      onClick={() => setGender(g.id)}
                      className="rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5"
                      style={
                        sel
                          ? { background: t.accent, color: t.onAccent }
                          : { background: "transparent", color: t.ink }
                      }
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>

              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2" aria-label={`Obsah boxu ${variant.name}`}>
                {items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={`${contentKey}-${i}`}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduce ? 0 : i * 0.045, duration: 0.3 }}
                      onMouseEnter={() => setHi(i)}
                      onMouseLeave={() => setHi(null)}
                      className="flex items-center gap-3.5 rounded-[22px] p-2.5 pr-4"
                      style={{ background: t.rowBg, boxShadow: `inset 0 0 0 1px ${t.border}` }}
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                        style={{ background: t.badgeBg, color: t.badgeInk }}
                      >
                        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold leading-snug">{item.name}</span>
                        <span className="block text-sm" style={{ color: t.muted }}>
                          {item.detail}
                        </span>
                      </span>
                    </motion.li>
                  );
                })}
              </ul>

              <div
                className="mt-7 flex flex-wrap items-center justify-between gap-5 rounded-[28px] p-4 pl-6"
                style={{ background: t.rowBg, boxShadow: `inset 0 0 0 1px ${t.border}` }}
              >
                <div>
                  <p className="font-display text-4xl font-medium leading-none">{formatPrice(variant.price)}</p>
                  <p className="mt-1.5 text-sm" style={{ color: t.muted }}>
                    bez DPH za jeden box, vždy 6 věcí
                  </p>
                </div>
                <a
                  href="#poptavka"
                  onClick={pickForForm}
                  className="inline-flex items-center rounded-full px-6 py-3.5 text-base font-semibold transition-transform active:scale-[0.97]"
                  style={{ background: t.accent, color: t.onAccent }}
                >
                  Objednat {accusative[variant.id]}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
