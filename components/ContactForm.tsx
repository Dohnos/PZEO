"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";

type Status = "idle" | "sending" | "done" | "error";

const field =
  "w-full rounded-full border-2 border-white/10 bg-white/[0.06] px-5 py-3.5 text-base text-[#f1eadb] placeholder:text-[#a79f8f] transition-colors focus:border-zlato focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [varianta, setVarianta] = useState("nevim");

  useEffect(() => {
    const onPick = (e: Event) => setVarianta((e as CustomEvent<string>).detail);
    window.addEventListener("pauzeo:varianta", onPick);
    return () => window.removeEventListener("pauzeo:varianta", onPick);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/poptavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Poptávku se nepodařilo odeslat.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Poptávku se nepodařilo odeslat. Zkontrolujte připojení a zkuste to znovu.");
      setStatus("error");
    }
  }

  return (
    <section id="poptavka" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[40px] bg-ocean p-6 text-[#f1eadb] sm:rounded-[48px] sm:p-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14 md:p-14">
        <div>
          <h2 className="font-display text-[clamp(2.4rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.015em]">
            Vyzkoušejte box nejdřív sami
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-[#cfc6b4]">
            Pošleme vám ukázku a nabídku na míru do dvou pracovních dnů.
          </p>
        </div>

        {status === "done" ? (
          <div className="flex flex-col items-start justify-center gap-4 rounded-[32px] bg-white/[0.06] p-8" role="status">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zlato text-ocean">
              <CheckCircle2 size={28} aria-hidden="true" />
            </span>
            <p className="font-display text-3xl font-medium">Poptávka odeslána</p>
            <p className="text-[#cfc6b4]">Ozveme se vám do dvou pracovních dnů.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="pl-5 text-sm font-medium text-[#cfc6b4]">Jméno a příjmení</span>
              <input name="jmeno" required autoComplete="name" className={field} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="pl-5 text-sm font-medium text-[#cfc6b4]">Firma</span>
              <input name="firma" required autoComplete="organization" className={field} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="pl-5 text-sm font-medium text-[#cfc6b4]">Pracovní e-mail</span>
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="pl-5 text-sm font-medium text-[#cfc6b4]">Počet zaměstnanců</span>
              <input name="pocet" type="number" min={1} inputMode="numeric" className={field} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="pl-5 text-sm font-medium text-[#cfc6b4]">Máme zájem o</span>
              <span className="relative">
                <select
                  name="varianta"
                  value={varianta}
                  onChange={(e) => setVarianta(e.target.value)}
                  className={`${field} appearance-none pr-12`}
                >
                  <option value="nevim" className="text-black">Zatím nevím</option>
                  <option value="kapka" className="text-black">Kapka</option>
                  <option value="vlna" className="text-black">Vlna</option>
                  <option value="ocean" className="text-black">Oceán</option>
                </select>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-zlato"
                />
              </span>
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="pl-5 text-sm font-medium text-[#cfc6b4]">Zpráva (nepovinné)</span>
              <textarea
                name="zprava"
                rows={3}
                className="w-full rounded-[26px] border-2 border-white/10 bg-white/[0.06] px-5 py-4 text-base text-[#f1eadb] transition-colors focus:border-zlato focus:outline-none"
              />
            </label>

            {status === "error" && (
              <p role="alert" className="rounded-[20px] bg-[#5a2320] px-5 py-3 text-[15px] text-[#ffe3dc] sm:col-span-2">
                {error}
              </p>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center rounded-full bg-zlato px-7 py-4 text-base font-semibold text-ocean transition-transform active:scale-[0.98] disabled:opacity-70 sm:w-auto"
              >
                {status === "sending" ? "Odesílám…" : "Odeslat poptávku"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
