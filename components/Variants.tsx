"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Package, PackageOpen } from "lucide-react";
import { BoxScene, Motif } from "@/components/BoxScene";
import { boxes, formatPrice, type Gender, type VariantId } from "@/data/boxes";

// 3D scéna se načítá až v prohlížeči (three.js)
const Box3D = dynamic(() => import("@/components/Box3D"), {
  ssr: false,
  loading: () => <div className="aspect-square w-full" />,
});

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
  const [dir, setDir] = useState(1);
  const [gender, setGender] = useState<Gender>("zeny");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState<number | null>(null);
  const [presenting, setPresenting] = useState<number | null>(null);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const inView = useInView(boxRef, { once: true, amount: 0.6 });
  const visible = useInView(boxRef, { amount: 0.05 });
  const reduce = useReducedMotion();

  const variant = boxes[active];
  const t = variant.theme;
  const items = variant.items[gender];
  const contentKey = `${variant.id}-${gender}`;

  // box se sám otevře, když sekce poprvé vjede do obrazovky
  useEffect(() => {
    if (inView) setOpen(true);
  }, [inView]);

  const go = (next: number, direction?: number) => {
    const n = (next + boxes.length) % boxes.length;
    setDir(direction ?? (n > active ? 1 : -1));
    setActive(n);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = (i + step + boxes.length) % boxes.length;
    go(next, step);
    tabsRef.current[next]?.focus();
  };

  const onSwipe = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(active + 1, 1);
    else if (info.offset.x > 60) go(active - 1, -1);
    // krátce zablokuje klik, aby tažení box neotevřelo/nezavřelo
    window.setTimeout(() => {
      dragged.current = false;
    }, 50);
  };

  const pickForForm = () => {
    window.dispatchEvent(new CustomEvent("pauzeo:varianta", { detail: variant.id }));
  };

  return (
    <section id="boxy" className="px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.015em]">
          Vyberte si box
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-hlubina-2">
          Tři varianty, vždy šest věcí. Stejná cena pro muže i&nbsp;ženy.
        </p>

        {/* velký přepínač variant */}
        <div className="mt-8">
          <div role="tablist" aria-label="Varianty boxu" className="grid grid-cols-3 gap-2 md:gap-4">
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
                  onClick={() => go(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className="relative flex flex-col items-center gap-1.5 rounded-[26px] p-2.5 text-center transition-transform active:scale-[0.97] md:flex-row md:gap-4 md:rounded-full md:p-3 md:pr-6 md:text-left"
                  style={{ background: selected ? "transparent" : "#ffffff" }}
                >
                  {selected && (
                    <motion.span
                      layoutId="variant-pill"
                      className="absolute inset-0 rounded-[26px] md:rounded-full"
                      style={{ background: b.theme.surface, boxShadow: "0 12px 30px rgba(15,42,54,0.18)" }}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:h-14 md:w-14"
                    style={{
                      background: selected ? b.theme.boxBody : b.theme.surface,
                      boxShadow: selected ? `0 0 0 3px ${b.theme.accent}` : "none",
                    }}
                  >
                    <Motif variant={b} className="h-[52%] w-[62%]" />
                  </span>
                  <span className="relative">
                    <span
                      className="block font-display text-lg font-medium leading-tight md:text-2xl"
                      style={{ color: selected ? b.theme.ink : "#0f2a36" }}
                    >
                      {b.name}
                    </span>
                    <span
                      className="block text-xs font-medium md:text-sm"
                      style={{ color: selected ? b.theme.muted : "#3f5a63" }}
                    >
                      {formatPrice(b.price)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          ref={panelRef}
          id="panel-boxu"
          role="tabpanel"
          aria-labelledby={`tab-${variant.id}`}
          className="relative mt-4 overflow-hidden rounded-[36px] p-5 sm:rounded-[44px] sm:p-8 md:mt-6 md:p-12"
          animate={{ backgroundColor: t.surface, color: t.ink }}
          transition={{ duration: reduce ? 0 : 0.5 }}
        >
          {/* velký vodoznak s názvem varianty */}
          <AnimatePresence initial={false}>
            <motion.span
              key={`wm-${variant.id}`}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[0.2em] right-[-0.04em] select-none font-display text-[clamp(7rem,22vw,17rem)] font-semibold leading-none"
              style={{ color: t.ink }}
              initial={reduce ? false : { x: dir * 140, opacity: 0 }}
              animate={{ x: 0, opacity: 0.06 }}
              exit={reduce ? { opacity: 0 } : { x: dir * -140, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {variant.name}
            </motion.span>
          </AnimatePresence>

          <div className="relative grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col items-center gap-5">
              <div ref={boxRef} className="relative w-full max-w-[480px]">
                <motion.div
                  drag={reduce ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragStart={() => {
                    dragged.current = true;
                  }}
                  onDragEnd={onSwipe}
                  onClick={() => {
                    if (!dragged.current) setOpen((v) => !v);
                  }}
                  className="cursor-grab touch-pan-y active:cursor-grabbing"
                  aria-hidden="true"
                >
                  <Box3D
                    variant={variant}
                    open={open}
                    restartKey={variant.id}
                    highlighted={hi}
                    reduce={!!reduce}
                    onPresent={setPresenting}
                    active={visible}
                    fallback={
                      <BoxScene variant={variant} items={items} open={open} contentKey={contentKey} highlighted={hi} />
                    }
                  />
                </motion.div>

                {/* popisek právě představované věci */}
                <div className="pointer-events-none absolute inset-x-0 bottom-[2%] flex justify-center px-14" aria-live="polite">
                  <AnimatePresence mode="wait">
                    {presenting !== null && items[presenting] && (
                      <motion.div
                        key={`${contentKey}-cap-${presenting}`}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="flex max-w-full items-center gap-3 rounded-full py-2 pl-2 pr-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                        style={{ background: t.badgeBg, color: t.badgeInk }}
                      >
                        {(() => {
                          const Icon = items[presenting].icon;
                          return (
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                              style={{ background: t.accent, color: t.onAccent }}
                            >
                              <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                            </span>
                          );
                        })()}
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold opacity-75">
                            {presenting + 1} ze 6
                          </span>
                          <span className="block truncate text-[15px] font-semibold leading-tight">
                            {items[presenting].name}
                          </span>
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => go(active - 1, -1)}
                  aria-label="Předchozí varianta"
                  className="absolute left-0 top-[76%] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-transform active:scale-90"
                  style={{ background: t.badgeBg, color: t.badgeInk, boxShadow: "0 6px 18px rgba(0,0,0,0.14)" }}
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1, 1)}
                  aria-label="Další varianta"
                  className="absolute right-0 top-[76%] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-transform active:scale-90"
                  style={{ background: t.badgeBg, color: t.badgeInk, boxShadow: "0 6px 18px rgba(0,0,0,0.14)" }}
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <div className="flex items-center gap-2" aria-hidden="true">
                {boxes.map((b, i) => (
                  <motion.span
                    key={b.id}
                    className="h-2 rounded-full"
                    animate={{ width: i === active ? 28 : 8, backgroundColor: t.ink, opacity: i === active ? 1 : 0.35 }}
                    transition={{ duration: reduce ? 0 : 0.3 }}
                  />
                ))}
              </div>

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
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={variant.id}
                  initial={reduce ? false : { opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="font-display text-[clamp(3rem,7vw,5rem)] font-medium leading-none tracking-[-0.02em]">
                    {variant.name}
                  </h3>
                  <p className="mt-3 text-lg font-medium" style={{ color: t.muted }}>
                    {variant.tagline}
                  </p>
                  <p className="mt-2 max-w-[46ch] leading-relaxed" style={{ color: t.muted }}>
                    {variant.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div
                className="mt-6 inline-flex rounded-full p-1"
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
                      style={sel ? { background: t.accent, color: t.onAccent } : { background: "transparent", color: t.ink }}
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
                className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-[28px] p-4 pl-6"
                style={{ background: t.rowBg, boxShadow: `inset 0 0 0 1px ${t.border}` }}
              >
                <div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={`price-${variant.id}`}
                      className="font-display text-4xl font-medium leading-none"
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {formatPrice(variant.price)}
                    </motion.p>
                  </AnimatePresence>
                  <p className="mt-1.5 text-sm" style={{ color: t.muted }}>
                    bez DPH za box
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
