import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="px-4 pb-10 pt-6 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[32px] bg-white px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="text-vlna">
            <Logo size={28} />
          </p>
          <p className="mt-2 text-sm text-hlubina-2">Wellbeing boxy pro firmy z českých manufaktur.</p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-hlubina-2 sm:items-end">
          <a href="mailto:ahoj@pauzeo.cz" className="font-semibold text-hlubina hover:text-vlna">
            ahoj@pauzeo.cz
          </a>
          <p>© {new Date().getFullYear()} Pauzeo</p>
        </div>
      </div>
    </footer>
  );
}
