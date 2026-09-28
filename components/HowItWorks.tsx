import { Leaf, Snowflake, Sprout, Sun } from "lucide-react";

const steps = [
  {
    title: "Vyberete box a počet lidí",
    text: "Kapku, Vlnu nebo Oceán. Pánskou a dámskou náplň kombinujete libovolně.",
  },
  {
    title: "Potvrdíte počty do uzávěrky",
    text: "Do 15. dne měsíce před rozesláním upravíte počty a zaplatíte fakturu na čtvrtletí.",
  },
  {
    title: "Nakoupíme a ručně zabalíme",
    text: "U českých manufaktur objednáme přesný počet věcí a každý box zabalíme ručně.",
  },
  {
    title: "Každý dostane svůj box",
    text: "Rozvezeme je do kanceláře, nebo každému zaměstnanci domů.",
  },
];

const seasons = [
  { icon: Snowflake, name: "Zahřej se", when: "Zimní box, leden", bg: "#dce9ec", ink: "#16323d" },
  { icon: Sprout, name: "Nabij se", when: "Jarní box, duben", bg: "#e3ecd9", ink: "#26401f" },
  { icon: Sun, name: "Vypni", when: "Letní box, červenec", bg: "#f2e6c8", ink: "#4a3a12" },
  { icon: Leaf, name: "Zpomal", when: "Podzimní box, říjen", bg: "#ecdccd", ink: "#4a2e1c" },
];

export function HowItWorks() {
  return (
    <section id="jak-to-funguje" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.015em]">
          Jak to funguje
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-hlubina-2">
          Předplatné na rok, čtyři boxy. Platíte vždy jen za čtvrtletí, které právě objednáváte.
        </p>

        <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          <div
            aria-hidden="true"
            className="absolute left-[27px] top-0 h-full w-0.5 rounded-full bg-hlubina/10 md:left-0 md:top-[27px] md:h-0.5 md:w-full"
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 md:flex-col md:gap-5">
              <span className="relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-hlubina font-display text-xl font-medium text-white shadow-[0_0_0_8px_var(--color-mlha)]">
                {i + 1}
              </span>
              <div className="pt-2 md:pt-0">
                <h3 className="text-lg font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-hlubina-2">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-[40px] bg-white p-6 sm:p-10">
          <h3 className="font-display text-3xl font-medium tracking-[-0.01em]">Rok s Pauzeo</h3>
          <p className="mt-2 max-w-lg text-hlubina-2">
            Každé roční období má svůj box s vlastním tématem a výběrem věcí.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {seasons.map(({ icon: Icon, name, when, bg, ink }) => (
              <li
                key={name}
                className="flex flex-col gap-6 rounded-[28px] p-5 sm:p-6"
                style={{ background: bg, color: ink }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70">
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-2xl font-medium leading-tight">{name}</span>
                  <span className="mt-1 block text-sm">{when}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
