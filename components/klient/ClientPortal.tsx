"use client";

import { useMemo, useState } from "react";
import { Check, Leaf, Snowflake, Sprout, Sun } from "lucide-react";
import { AppBar, AppFooter, Button, Card, Field, Input, Notice, Select, Textarea, callApi } from "@/components/ui";
import type { ClientState } from "@/lib/clientState";
import { editionLabel, formatDate, formatPrice, orderFlow, orderStatusLabels } from "@/lib/labels";
import type { Order, OrderStatus, SeasonId, VariantId } from "@/lib/types";

const seasonIcons: Record<SeasonId, typeof Sun> = { jaro: Sprout, leto: Sun, podzim: Leaf, zima: Snowflake };

const statusColors: Record<OrderStatus, string> = {
  nova: "bg-[#f3e7c9] text-[#4a3a12]",
  potvrzena: "bg-[#dce9ec] text-[#16323d]",
  zaplacena: "bg-[#dce9ec] text-[#16323d]",
  baleni: "bg-[#e3ecd9] text-[#26401f]",
  odeslana: "bg-[#e3ecd9] text-[#26401f]",
  dorucena: "bg-hlubina text-white",
  zrusena: "bg-[#f6dcd6] text-[#6b1f14]",
};

type Counts = Record<VariantId, { zeny: number; muzi: number }>;

function Tracker({ order }: { order: Order }) {
  const idx = orderFlow.indexOf(order.status);
  return (
    <ol className="mt-6 grid grid-cols-6 gap-1" aria-label="Průběh objednávky">
      {orderFlow.map((s, i) => {
        const done = i <= idx;
        return (
          <li key={s} className="flex flex-col items-center gap-2 text-center">
            <span className="relative flex w-full items-center justify-center">
              {i > 0 && (
                <span className={`absolute right-1/2 top-1/2 h-1 w-full -translate-y-1/2 rounded-full ${i <= idx ? "bg-vlna" : "bg-hlubina/10"}`} />
              )}
              <span
                className={`relative z-[1] flex h-9 w-9 items-center justify-center rounded-full ${
                  done ? "bg-vlna text-white" : "bg-mlha text-hlubina-2"
                } ${i === idx ? "ring-4 ring-vlna/20" : ""}`}
              >
                {done ? <Check size={17} aria-hidden="true" /> : <span className="text-sm font-semibold">{i + 1}</span>}
              </span>
            </span>
            <span className={`text-[11px] font-semibold leading-tight sm:text-xs ${i === idx ? "text-hlubina" : "text-hlubina-2"}`}>
              {orderStatusLabels[s]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function ClientPortal({ initial }: { initial: ClientState }) {
  const [state, setState] = useState(initial);
  const [toast, setToast] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const { client, orders, edition, boxes } = state;
  const label = editionLabel(edition);
  const SeasonIcon = seasonIcons[edition.season];

  const currentOrder = orders.find((o) => o.edition === label && o.status !== "zrusena");
  const active = orders.find((o) => !["dorucena", "zrusena"].includes(o.status));
  const names = useMemo(() => Object.fromEntries(boxes.map((b) => [b.id, b.name])), [boxes]);

  const initialCounts = (): Counts => {
    const c: Counts = { kapka: { zeny: 0, muzi: 0 }, vlna: { zeny: 0, muzi: 0 }, ocean: { zeny: 0, muzi: 0 } };
    currentOrder?.lines.forEach((l) => (c[l.variant] = { zeny: l.zeny, muzi: l.muzi }));
    return c;
  };
  const [counts, setCounts] = useState<Counts>(initialCounts);
  const [note, setNote] = useState(currentOrder?.note ?? "");
  const [profile, setProfile] = useState(client);
  const [busy, setBusy] = useState(false);

  const count = (Object.keys(counts) as VariantId[]).reduce((s, v) => s + counts[v].zeny + counts[v].muzi, 0);
  const total = boxes.reduce((s, b) => s + (counts[b.id].zeny + counts[b.id].muzi) * b.price, 0);
  const canEditOrder = edition.open && (!currentOrder || currentOrder.status === "nova");

  const act = async (action: string, payload: Record<string, unknown>, success: string) => {
    setBusy(true);
    try {
      const res = await callApi<{ state: ClientState }>("/api/klient", action, payload);
      setState(res.state);
      setToast({ tone: "ok", text: success });
      window.setTimeout(() => setToast(null), 2600);
    } catch (err) {
      setToast({ tone: "error", text: (err as Error).message });
    }
    setBusy(false);
  };

  const logout = async () => {
    await callApi("/api/klient", "logout").catch(() => null);
    window.location.reload();
  };

  const summary = (o: Order) => o.lines.map((l) => `${names[l.variant] ?? l.variant}: ${l.zeny + l.muzi}`).join(", ");

  return (
    <>
      <AppBar title="Klientská sekce" onLogout={logout} />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pt-8 sm:px-6">
        <div>
          <p className="text-hlubina-2">{client.company}</p>
          <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-medium leading-none">
            Dobrý den{client.contactName ? `, ${client.contactName.split(" ")[0]}` : ""}
          </h1>
        </div>

        {/* aktuální objednávka se stavem */}
        {active && (
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-hlubina-2">Aktuální objednávka {active.number}</p>
                <h2 className="mt-1 font-display text-3xl font-medium">{active.edition}</h2>
                <p className="mt-1 text-hlubina-2">{summary(active)} boxů</p>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${statusColors[active.status]}`}>
                {orderStatusLabels[active.status]}
              </span>
            </div>
            <Tracker order={active} />
          </Card>
        )}

        {/* objednávka na aktuální edici */}
        <Card>
          <div className="flex items-start gap-4">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${edition.open ? "bg-vlna text-white" : "bg-mlha text-hlubina-2"}`}>
              <SeasonIcon size={22} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-3xl font-medium">{label}</h2>
              <p className="mt-1 text-hlubina-2">
                {edition.open
                  ? `Objednávky do ${formatDate(edition.deadline)}, doručení: ${edition.delivery}.`
                  : "Objednávky na tuto edici jsou uzavřené."}
              </p>
            </div>
          </div>

          {currentOrder && currentOrder.status !== "nova" ? (
            <div className="mt-5">
              <Notice tone="ok">
                Objednávka {currentOrder.number} je {orderStatusLabels[currentOrder.status].toLowerCase()}. Změny prosím pošlete na
                ahoj@pauzeo.cz.
              </Notice>
            </div>
          ) : canEditOrder ? (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {boxes.map((b) => (
                  <div key={b.id} className="rounded-[22px] bg-mlha p-4">
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-sm text-hlubina-2">{formatPrice(b.price)} za box</p>
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
              <Field label="Poznámka k doručení" className="mt-4">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
              </Field>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-mlha p-4 pl-5">
                <div>
                  <p className="font-display text-3xl">{formatPrice(total)}</p>
                  <p className="text-sm text-hlubina-2">
                    {count} boxů bez DPH{count > 0 && count < 10 ? ", minimum je 10" : ""}
                  </p>
                </div>
                <Button
                  disabled={busy || count < 10}
                  onClick={() =>
                    act(
                      "order",
                      { lines: (Object.keys(counts) as VariantId[]).map((variant) => ({ variant, ...counts[variant] })), note },
                      currentOrder ? "Objednávka upravena." : "Objednávka odeslána. Brzy ji potvrdíme.",
                    )
                  }
                >
                  {currentOrder ? "Uložit změny objednávky" : "Odeslat objednávku"}
                </Button>
              </div>
            </>
          ) : null}
        </Card>

        {/* historie */}
        <Card>
          <h2 className="font-display text-3xl font-medium">Historie objednávek</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-hlubina-2">Zatím žádné objednávky.</p>
          ) : (
            <ul className="mt-5 flex flex-col gap-2.5">
              {orders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-mlha px-5 py-4">
                  <div>
                    <p className="font-semibold">{o.edition}</p>
                    <p className="text-sm text-hlubina-2">
                      {o.number}, {summary(o)} boxů
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{formatPrice(o.total)}</p>
                    <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${statusColors[o.status]}`}>
                      {orderStatusLabels[o.status]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* údaje o firmě */}
        <Card>
          <h2 className="font-display text-3xl font-medium">Údaje o firmě</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Název firmy" className="sm:col-span-2">
              <Input value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
            </Field>
            <Field label="IČO">
              <Input value={profile.ico} onChange={(e) => setProfile({ ...profile, ico: e.target.value })} />
            </Field>
            <Field label="DIČ">
              <Input value={profile.dic} onChange={(e) => setProfile({ ...profile, dic: e.target.value })} />
            </Field>
            <Field label="Ulice a číslo" className="sm:col-span-2">
              <Input value={profile.street} onChange={(e) => setProfile({ ...profile, street: e.target.value })} />
            </Field>
            <Field label="Město">
              <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
            </Field>
            <Field label="PSČ">
              <Input value={profile.zip} onChange={(e) => setProfile({ ...profile, zip: e.target.value })} />
            </Field>
            <Field label="Kontaktní osoba">
              <Input value={profile.contactName} onChange={(e) => setProfile({ ...profile, contactName: e.target.value })} />
            </Field>
            <Field label="Telefon">
              <Input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </Field>
            <Field label="E-mail pro přihlášení" hint="Změnu e-mailu vyřídíme na ahoj@pauzeo.cz." className="sm:col-span-2">
              <Input value={profile.email} disabled />
            </Field>
            <Field label="Doručení boxů" className="sm:col-span-2">
              <Select
                value={profile.delivery}
                onChange={(e) => setProfile({ ...profile, delivery: e.target.value as "kancelar" | "domu" })}
              >
                <option value="kancelar">Hromadně do kanceláře</option>
                <option value="domu">Každému zaměstnanci domů</option>
              </Select>
            </Field>
          </div>
          <div className="mt-6">
            <Button disabled={busy} onClick={() => act("updateProfile", { profile }, "Údaje uloženy.")}>
              Uložit údaje
            </Button>
          </div>
        </Card>
      </main>

      {toast && (
        <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4" role="status">
          <div
            className={`rounded-full px-6 py-3.5 text-[15px] font-semibold shadow-[0_12px_30px_rgba(15,42,54,0.2)] ${
              toast.tone === "ok" ? "bg-hlubina text-white" : "bg-[#9b2c1f] text-white"
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}
      <AppFooter />
    </>
  );
}
