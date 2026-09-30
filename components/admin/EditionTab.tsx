"use client";

import { useState } from "react";
import type { Run } from "@/components/admin/AdminApp";
import { Button, Card, Field, Input, Notice, Select } from "@/components/ui";
import { editionLabel, formatDate, seasonLabels } from "@/lib/labels";
import type { Catalog, Edition, SeasonId } from "@/lib/types";

export function EditionTab({ catalog, run }: { catalog: Catalog; run: Run }) {
  const [ed, setEd] = useState<Edition>(catalog.edition);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Edition>(k: K, v: Edition[K]) => setEd((e) => ({ ...e, [k]: v }));

  const save = async () => {
    setBusy(true);
    await run("saveCatalog", { catalog: { ...catalog, edition: ed } }, "Aktuální edice uložena.");
    setBusy(false);
  };

  return (
    <Card>
      <h2 className="font-display text-3xl font-medium">Aktuální edice</h2>
      <p className="mt-1 text-hlubina-2">Co se právě prodává. Zobrazuje se na webu v sekci „Vyberte si box“ a v klientské sekci.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Roční období">
          <Select value={ed.season} onChange={(e) => set("season", e.target.value as SeasonId)}>
            {(Object.keys(seasonLabels) as SeasonId[]).map((s) => (
              <option key={s} value={s}>
                {seasonLabels[s].box} ({seasonLabels[s].theme})
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Rok">
          <Input type="number" inputMode="numeric" value={ed.year} onChange={(e) => set("year", Number(e.target.value))} />
        </Field>
        <Field label="Uzávěrka objednávek">
          <Input type="date" value={ed.deadline} onChange={(e) => set("deadline", e.target.value)} />
        </Field>
        <Field label="Doručení" hint="Např. „leden 2027“">
          <Input value={ed.delivery} onChange={(e) => set("delivery", e.target.value)} />
        </Field>
      </div>

      <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-[22px] bg-mlha px-5 py-4">
        <span>
          <span className="block font-semibold">Objednávky otevřené</span>
          <span className="text-sm text-hlubina-2">Když je vypnuto, web ukáže, že je edice uzavřená, a klienti nemohou objednat.</span>
        </span>
        <input
          type="checkbox"
          checked={ed.open}
          onChange={(e) => set("open", e.target.checked)}
          className="h-7 w-12 shrink-0 cursor-pointer appearance-none rounded-full bg-hlubina/20 transition-colors before:block before:h-6 before:w-6 before:translate-x-0.5 before:rounded-full before:bg-white before:transition-transform checked:bg-vlna checked:before:translate-x-[22px]"
        />
      </label>

      <div className="mt-5">
        <Notice tone="info">
          <b>Náhled na webu:</b>{" "}
          {ed.open
            ? `Právě objednáváte: ${editionLabel(ed)}. Uzávěrka ${formatDate(ed.deadline)}, doručení: ${ed.delivery}.`
            : `${editionLabel(ed)}: objednávky jsou uzavřené.`}
        </Notice>
      </div>

      <div className="mt-6">
        <Button onClick={save} disabled={busy}>
          {busy ? "Ukládám…" : "Uložit edici"}
        </Button>
      </div>
    </Card>
  );
}
