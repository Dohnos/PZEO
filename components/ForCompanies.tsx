import { CalendarCheck, Factory, Receipt, Users } from "lucide-react";

const benefits = [
  { icon: Users, title: "Pánská i dámská náplň", text: "Za stejnou cenu, HR jen zadá počty." },
  { icon: CalendarCheck, title: "Počty měníte do uzávěrky", text: "Nástupy a odchody vyřešíte e-mailem." },
  { icon: Receipt, title: "Jedna faktura za čtvrtletí", text: "Žádné objednávky po kusech." },
  { icon: Factory, title: "Od českých manufaktur", text: "Čaje, svíčky a kosmetika od malých výrobců." },
];

export function ForCompanies() {
  return (
    <section id="pro-firmy" className="px-4 py-14 sm:px-6 md:py-20">
      <div className="relative mx-auto grid max-w-6xl gap-10 overflow-hidden rounded-[40px] bg-vlna p-6 text-[#f6f1e7] sm:rounded-[48px] sm:p-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14 md:p-14">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/[0.06]" />
        <div className="relative">
          <h2 className="font-display text-[clamp(2.4rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.015em]">
            Benefit, na který se lidé těší
          </h2>
          <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-[#dce7e3]">
            Box s vaším vzkazem si zaměstnanci pamatují celé čtvrtletí.
          </p>
          <a
            href="#poptavka"
            className="mt-8 inline-flex rounded-full bg-pisek px-7 py-4 font-semibold text-[#173c3f] transition-transform active:scale-[0.97]"
          >
            Objednat ukázkový box
          </a>
        </div>

        <ul className="relative grid gap-3 sm:grid-cols-2">
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col gap-4 rounded-[28px] bg-white/[0.08] p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f1e7] text-vlna">
                <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-semibold leading-snug">{title}</span>
                <span className="mt-1 block text-[15px] leading-relaxed text-[#dce7e3]">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
