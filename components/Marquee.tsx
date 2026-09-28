import { CircleDot, Coffee, Cookie, Droplet, Flame, GlassWater, Hexagon, NotebookPen } from "lucide-react";

const things = [
  { icon: Coffee, text: "Bylinné čaje" },
  { icon: Flame, text: "Sójové svíčky" },
  { icon: Droplet, text: "Přírodní kosmetika" },
  { icon: Hexagon, text: "Med od včelaře" },
  { icon: GlassWater, text: "České sklo" },
  { icon: Cookie, text: "Čokoláda z manufaktury" },
  { icon: CircleDot, text: "Masážní pomůcky" },
  { icon: NotebookPen, text: "Deníky" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 gap-3 pr-3" aria-hidden={hidden || undefined}>
      {things.map(({ icon: Icon, text }) => (
        <li
          key={text}
          className="inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-white py-2.5 pl-2.5 pr-5 text-[15px] font-medium text-hlubina"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mlha text-vlna">
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
          </span>
          {text}
        </li>
      ))}
    </ul>
  );
}

/** Nekonečný pás s tím, co se v boxech objevuje. */
export function Marquee() {
  return (
    <section aria-label="Co v boxech najdete" className="overflow-hidden py-4">
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
