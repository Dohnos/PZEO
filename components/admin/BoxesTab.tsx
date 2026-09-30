"use client";

import { useState } from "react";
import type { Run } from "@/components/admin/AdminApp";
import { Button, Card, Field, Input, Notice, Select, Textarea } from "@/components/ui";
import { icons } from "@/lib/icons";
import { iconLabels, modelLabels } from "@/lib/labels";
import type { BoxData, Catalog, Gender, IconKey, ItemData, ModelKey } from "@/lib/types";

export function BoxesTab({ catalog, run }: { catalog: Catalog; run: Run }) {
  const [boxes, setBoxes] = useState<BoxData[]>(structuredClone(catalog.boxes));
  const [active, setActive] = useState(0);
  const [gender, setGender] = useState<Gender>("zeny");
  const [busy, setBusy] = useState(false);
  const box = boxes[active];

  const setBox = (patch: Partial<BoxData>) =>
    setBoxes((list) => list.map((b, i) => (i === active ? { ...b, ...patch } : b)));

  const setItem = (idx: number, patch: Partial<ItemData>) =>
    setBoxes((list) =>
      list.map((b, i) =>
        i !== active
          ? b
          : { ...b, items: { ...b.items, [gender]: b.items[gender].map((it, j) => (j === idx ? { ...it, ...patch } : it)) } },
      ),
    );

  const save = async () => {
    setBusy(true);
    await run("saveCatalog", { catalog: { ...catalog, boxes } }, "Boxy uloženy. Web se aktualizoval.");
    setBusy(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="inline-flex self-start rounded-full bg-white p-1.5">
        {boxes.map((b, i) => (
          <button
            key={b.id}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2.5 font-semibold transition-colors ${i === active ? "bg-vlna text-white" : "text-hlubina-2 hover:bg-mlha"}`}
          >
            {b.name}
          </button>
        ))}
      </div>

      <Card>
        <h2 className="font-display text-3xl font-medium">Box {box.name}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Název">
            <Input value={box.name} onChange={(e) => setBox({ name: e.target.value })} />
          </Field>
          <Field label="Cena za box bez DPH (Kč)">
            <Input type="number" inputMode="numeric" min={1} value={box.price} onChange={(e) => setBox({ price: Number(e.target.value) })} />
          </Field>
          <Field label="Podtitulek" className="sm:col-span-2">
            <Input value={box.tagline} onChange={(e) => setBox({ tagline: e.target.value })} />
          </Field>
          <Field label="Popis (jedna věta)" className="sm:col-span-2">
            <Textarea value={box.description} onChange={(e) => setBox({ description: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-medium">Obsah boxu</h3>
          <div className="inline-flex rounded-full bg-mlha p-1">
            {(["zeny", "muzi"] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={g === gender}
                onClick={() => setGender(g)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${g === gender ? "bg-hlubina text-white" : "text-hlubina-2"}`}
              >
                {g === "zeny" ? "Dámská náplň" : "Pánská náplň"}
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-5 flex flex-col gap-3">
          {box.items[gender].map((it, idx) => {
            const Icon = icons[it.icon];
            return (
              <li key={idx} className="rounded-[22px] bg-mlha p-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-vlna">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="font-semibold">Věc {idx + 1}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Název">
                    <Input value={it.name} onChange={(e) => setItem(idx, { name: e.target.value })} />
                  </Field>
                  <Field label="Detail">
                    <Input value={it.detail} onChange={(e) => setItem(idx, { detail: e.target.value })} />
                  </Field>
                  <Field label="Ikona">
                    <Select value={it.icon} onChange={(e) => setItem(idx, { icon: e.target.value as IconKey })}>
                      {(Object.keys(iconLabels) as IconKey[]).map((k) => (
                        <option key={k} value={k}>
                          {iconLabels[k]}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="3D model v animaci">
                    <Select value={it.model} onChange={(e) => setItem(idx, { model: e.target.value as ModelKey })}>
                      {(Object.keys(modelLabels) as ModelKey[]).map((k) => (
                        <option key={k} value={k}>
                          {modelLabels[k]}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-5">
          <Notice tone="info">
            Nový produkt, pro který tu chybí 3D model? Pošlete popis a fotku a model se doplní do knihovny v příští verzi.
          </Notice>
        </div>
      </Card>

      <div className="sticky bottom-4 z-30 flex justify-end">
        <Button onClick={save} disabled={busy} className="shadow-[0_12px_30px_rgba(15,42,54,0.25)]">
          {busy ? "Ukládám…" : "Uložit všechny boxy"}
        </Button>
      </div>
    </div>
  );
}
