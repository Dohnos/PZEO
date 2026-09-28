import { CalendarCheck, Factory, HandHeart, Receipt, Truck, Users } from "lucide-react";

const benefits = [
  { icon: Users, title: "Pánská i dámská náplň", text: "Za stejnou cenu. HR jen zadá počty." },
  { icon: CalendarCheck, title: "Počty měníte do uzávěrky", text: "Nástupy a odchody vyřešíte jedním e-mailem." },
  { icon: Receipt, title: "Jedna faktura za čtvrtletí", text: "Žádné objednávky po kusech ani skladování." },
  { icon: Factory, title: "Od českých manufaktur", text: "Čaje, svíčky a kosmetika od malých výrobců." },
  { icon: Truck, title: "Domů i do kanceláře", text: "Na jednu adresu, nebo každému zvlášť." },
  { icon: HandHeart, title: "Balení v chráněné dílně", text: "S možností náhradního plnění." },
];

export function ForCompanies() {
  return (
    <section id="pro-firmy" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[40px] bg-vlna p-6 text-[#f6f1e7] sm:rounded-[48px] sm:p-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14 md:p-14">
        <div>
          <h2 className="font-display text-[clamp(2.4rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.015em]">
            Benefit, na který se lidé těší
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-[#dce7e3]">
            Stravenky se rozplynou ve výplatě. Box, který přijde domů s vaším vzkazem, si
            zaměstnanci pamatují celé čtvrtletí.
          </p>
          <a
            href="#poptavka"
            className="mt-8 inline-flex rounded-full bg-pisek px-7 py-4 font-semibold text-[#173c3f] transition-transform active:scale-[0.97]"
          >
            Objednat ukázkový box
          </a>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 rounded-[26px] bg-white/[0.08] p-4 sm:p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f6f1e7] text-vlna">
                <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold leading-snug">{title}</span>
                <span className="mt-1 block text-[15px] leading-relaxed text-[#dce7e3]">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
