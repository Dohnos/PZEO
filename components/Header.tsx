"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "#boxy", label: "Boxy" },
  { href: "#jak-to-funguje", label: "Jak to funguje" },
  { href: "#pro-firmy", label: "Pro firmy" },
  { href: "#otazky", label: "Otázky" },
  { href: "/klient", label: "Pro klienty" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className="sticky top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Hlavní navigace"
          className="flex items-center justify-between gap-4 rounded-full border border-hlubina/10 bg-white/80 py-2 pl-5 pr-2 shadow-[0_8px_30px_rgba(15,42,54,0.08)] backdrop-blur-md"
        >
          <a href="#" aria-label="Pauzeo, na začátek stránky" className="text-vlna">
            <Logo size={21} />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2.5 text-[15px] font-medium text-hlubina-2 transition-colors hover:bg-mlha hover:text-hlubina"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#poptavka"
              className="hidden rounded-full bg-hlubina px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-vlna sm:inline-flex"
            >
              Objednat ukázku
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-mlha text-hlubina md:hidden"
              aria-expanded={open}
              aria-controls="mobilni-menu"
              aria-label={open ? "Zavřít menu" : "Otevřít menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobilni-menu"
            className="mt-2 rounded-[28px] border border-hlubina/10 bg-white p-3 shadow-[0_16px_40px_rgba(15,42,54,0.12)] md:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3.5 text-lg font-medium text-hlubina hover:bg-mlha"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <a
                  href="#poptavka"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-hlubina px-5 py-3.5 text-center font-semibold text-white"
                >
                  Objednat ukázku
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
