"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Run } from "@/components/admin/AdminApp";
import { Button, Card, Field, Input, Notice, Select, Textarea } from "@/components/ui";
import type { AdminState } from "@/lib/adminState";
import { editionLabel, formatPrice, orderStatusLabels } from "@/lib/labels";
import type { Order, OrderStatus, VariantId } from "@/lib/types";

type Counts = Record<VariantId, { zeny: number; muzi: number }>;
const empty = (): Counts => ({ kapka: { zeny: 0, muzi: 0 }, vlna: { zeny: 0, muzi: 0 }, ocean: { zeny: 0, muzi: 0 } });

export const statusColors: Record<OrderStatus, string> = {
  nova: "bg-[#f3e7c9] text-[#4a3a12]",
  potvrzena: "bg-[#dce9ec] text-[#16323d]",
  zaplacena: "bg-[#dce9ec] text-[#16323d]",
  baleni: "bg-[#e3ecd9] text-[#26401f]",
  odeslana: "bg-[#e3ecd9] text-[#26401f]",
  dorucena: "bg-hlubina text-white",
  zrusena: "bg-[#f6dcd6] text-[#6b1f14]",
};

export function OrdersTab({ state, run }: { state: AdminState; run: Run }) {
  const { orders, clients, catalog } = state;
  const [filter, setFilter] = useState<"vse" | OrderStatus>("vse");
  const [adding, setAdding] = useState(false);
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [edition, setEdition] = useState(editionLabel(catalog.edition));
  const [counts, setCounts] = useState<Counts>(empty);
  const [note, setNote] = useState("");

  const names = useMemo(() => Object.fromEntries(catalog.boxes.map((b) => [b.id, b.name])), [catalog.boxes]);
  const prices = useMemo(() => Object.fromEntries(catalog.boxes.map((b) => [b.id, b.price])), [catalog.boxes]);
  const company = (id: string) => clients.find((c) => c.id === id)?.company ?? "Smazaný klient";
  const list = filter === "vse" ? orders : orders.filter((o) => o.status === filter);
  const newTotal = (Object.keys(counts) as VariantId[]).reduce((s, v) => s + (counts[v].zeny + counts[v].muzi) * prices[v], 0);

  const create = async () => {
    const lines = (Object.keys(counts) as VariantId[]).map((variant) => ({ variant, ...counts[variant] }));
    const ok = await run("saveOrder", { order: { clientId, edition, lines, note, status: "potvrzena" } }, "Objednávka vytvořena.");
    if (ok) {
      setAdding(false);
      setCounts(empty());
      setNote("");
    }
  };

  const summary = (o: Order) =>
    o.lines.map((l) => `${names[l.variant]}: ${l.zeny} Ž + ${l.muzi} M`).join(", ");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Field label="Filtrovat podle stavu" className="w-full sm:w-64">
          <Select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="vse">Všechny objednávky</option>
            {(Object.keys(orderStatusLabels) as OrderStatus[]).map((s) => (
              <option key={s} value={s}>
                {orderStatusLabels[s]}
              </option>
            ))}
          </Select>
        </Field>
        <Button onClick={() => setAdding((v) => !v)} tone={adding ? "secondary" : "primary"}>
          <Plus size={18} aria-hidden="true" />
          {adding ? "Zavřít formulář" : "Nová objednávka"}
        </Button>
      </div>

      {adding && (
        <Card>
          <h2 className="font-display text-2xl font-medium">Nová objednávka</h2>
          {clients.length === 0 ? (
            <div className="mt-4">
              <Notice tone="warn">Nejdřív přidejte klienta v záložce Klienti.</Notice>
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Klient">
                  <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Edice">
                  <Input value={edition} onChange={(e) => setEdition(e.target.value)} />
                </Field>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {catalog.boxes.map((b) => (
                  <div key={b.id} className="rounded-[22px] bg-mlha p-4">
                    <p className="font-semibold">{b.name}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {(["zeny", "muzi"] as const).map((g) => (
                        <Field key={g} label={g === "zeny" ? "Ženy" : "Muži"}>
                          <Input
                            type="number"
                            min={0}
                            inputMode="numeric"
                            value={counts[b.id][g]}
                            onChange={(e) =>
                              setCounts((c) => ({ ...c, [b.id]: { ...c[b.id], [g]: Math.max(0, Number(e.target.value)) } }))
                            }
                          />
                        </Field>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Field label="Poznámka" className="mt-4">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
              </Field>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-2xl">{formatPrice(newTotal)}</p>
                <Button onClick={create}>Vytvořit objednávku</Button>
              </div>
            </>
          )}
        </Card>
      )}

      {list.length === 0 ? (
        <Card>
          <p className="text-hlubina-2">Žádné objednávky.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((o) => (
            <li key={o.id}>
              <Card className="!p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-hlubina-2">
                      {o.number}, {new Date(o.createdAt).toLocaleDateString("cs-CZ")}
                    </p>
                    <p className="mt-1 text-lg font-semibold">{company(o.clientId)}</p>
                    <p className="text-hlubina-2">{o.edition}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${statusColors[o.status]}`}>
                    {orderStatusLabels[o.status]}
                  </span>
                </div>
                <p className="mt-3 text-[15px]">{summary(o)}</p>
                {o.note && <p className="mt-1 text-sm text-hlubina-2">Poznámka: {o.note}</p>}
                <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                  <p className="font-display text-2xl">{formatPrice(o.total)}</p>
                  <div className="flex flex-wrap items-end gap-2">
                    <Field label="Změnit stav" className="w-48">
                      <Select
                        value={o.status}
                        onChange={(e) => run("saveOrder", { order: { ...o, status: e.target.value } }, "Stav změněn.")}
                      >
                        {(Object.keys(orderStatusLabels) as OrderStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {orderStatusLabels[s]}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Button
                      tone="danger"
                      aria-label={`Smazat objednávku ${o.number}`}
                      onClick={() => {
                        if (window.confirm(`Opravdu smazat objednávku ${o.number}?`)) run("deleteOrder", { id: o.id }, "Objednávka smazána.");
                      }}
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
