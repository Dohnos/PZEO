"use client";

import { Check, Mail, RotateCcw, Trash2 } from "lucide-react";
import type { Run } from "@/components/admin/AdminApp";
import { Button, Card } from "@/components/ui";
import type { Lead } from "@/lib/types";

const variantNames: Record<string, string> = { kapka: "Kapka", vlna: "Vlna", ocean: "Oceán", nevim: "Zatím neví" };

export function LeadsTab({ leads, run }: { leads: Lead[]; run: Run }) {
  if (leads.length === 0)
    return (
      <Card>
        <p className="text-hlubina-2">Zatím žádné poptávky z webu.</p>
      </Card>
    );

  return (
    <ul className="flex flex-col gap-3">
      {leads.map((l) => (
        <li key={l.id}>
          <Card className={`!p-5 ${l.handled ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-hlubina-2">{new Date(l.createdAt).toLocaleString("cs-CZ")}</p>
                <p className="mt-1 text-lg font-semibold">{l.firma}</p>
                <p className="text-hlubina-2">
                  {l.jmeno}, {l.email}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${l.handled ? "bg-mlha text-hlubina-2" : "bg-[#f3e7c9] text-[#4a3a12]"}`}>
                {l.handled ? "Vyřízeno" : "Nová"}
              </span>
            </div>
            <p className="mt-3 text-[15px]">
              Zájem: {variantNames[l.varianta] ?? l.varianta}
              {l.pocet ? `, ${l.pocet} zaměstnanců` : ""}
            </p>
            {l.zprava && <p className="mt-2 whitespace-pre-line rounded-[18px] bg-mlha px-4 py-3 text-[15px]">{l.zprava}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`mailto:${l.email}?subject=${encodeURIComponent("Pauzeo: ukázkový box")}`}
                className="inline-flex items-center gap-2 rounded-full bg-hlubina px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-vlna"
              >
                <Mail size={16} aria-hidden="true" /> Odpovědět
              </a>
              <Button tone="secondary" className="px-4 py-2.5" onClick={() => run("toggleLead", { id: l.id }, l.handled ? "Vráceno mezi nové." : "Označeno jako vyřízené.")}>
                {l.handled ? <RotateCcw size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
                {l.handled ? "Vrátit" : "Vyřízeno"}
              </Button>
              <Button
                tone="danger"
                className="px-4 py-2.5"
                aria-label="Smazat poptávku"
                onClick={() => {
                  if (window.confirm("Opravdu smazat poptávku?")) run("deleteLead", { id: l.id }, "Poptávka smazána.");
                }}
              >
                <Trash2 size={16} aria-hidden="true" />
              </Button>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
