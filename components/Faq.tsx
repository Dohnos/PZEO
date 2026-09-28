import { Plus } from "lucide-react";

const faq = [
  {
    q: "Kdy box dorazí?",
    a: "V lednu, dubnu, červenci a říjnu. Přesný termín najdete na faktuře.",
  },
  {
    q: "Můžeme měnit počet boxů?",
    a: "Ano, do 15. dne měsíce před rozesláním. Potom je objednávka závazná.",
  },
  {
    q: "Jak se platí?",
    a: "Fakturou na každé čtvrtletí předem. Za platbu celého roku najednou dáváme slevu 10 %.",
  },
  {
    q: "Co když má někdo alergii?",
    a: "Napište nám to k objednávce a položku vyměníme za jinou ve stejné hodnotě.",
  },
];

export function Faq() {
  return (
    <section id="otazky" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <h2 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.015em]">
          Časté otázky
        </h2>
        <div className="flex flex-col gap-3">
          {faq.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-[28px] bg-white px-6 py-1 open:pb-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold leading-snug">
                {q}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mlha transition-transform duration-300 group-open:rotate-45">
                  <Plus size={20} aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-[60ch] leading-relaxed text-hlubina-2">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
