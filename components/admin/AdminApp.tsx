"use client";

import { useState } from "react";
import { CalendarRange, Inbox, Package, ShoppingBag, Users } from "lucide-react";
import { AppBar, AppFooter, Notice, callApi } from "@/components/ui";
import { BoxesTab } from "@/components/admin/BoxesTab";
import { ClientsTab } from "@/components/admin/ClientsTab";
import { EditionTab } from "@/components/admin/EditionTab";
import { LeadsTab } from "@/components/admin/LeadsTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import type { AdminState } from "@/lib/adminState";
import { editionLabel, formatPrice } from "@/lib/labels";

const tabs = [
  { id: "edice", label: "Edice", icon: CalendarRange },
  { id: "boxy", label: "Boxy", icon: Package },
  { id: "objednavky", label: "Objednávky", icon: ShoppingBag },
  { id: "klienti", label: "Klienti", icon: Users },
  { id: "poptavky", label: "Poptávky", icon: Inbox },
] as const;

type TabId = (typeof tabs)[number]["id"];

export type Run = (action: string, payload?: Record<string, unknown>, success?: string) => Promise<Record<string, unknown> | null>;

export function AdminApp({ initial }: { initial: AdminState }) {
  const [state, setState] = useState(initial);
  const [tab, setTab] = useState<TabId>("edice");
  const [toast, setToast] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const run: Run = async (action, payload = {}, success = "Uloženo.") => {
    try {
      const res = await callApi<AdminState & Record<string, unknown>>("/api/admin", action, payload);
      setState({ catalog: res.catalog, clients: res.clients, orders: res.orders, leads: res.leads, storage: res.storage });
      setToast({ tone: "ok", text: success });
      window.setTimeout(() => setToast(null), 2600);
      return res;
    } catch (err) {
      setToast({ tone: "error", text: (err as Error).message });
      return null;
    }
  };

  const logout = async () => {
    await callApi("/api/admin", "logout").catch(() => null);
    window.location.reload();
  };

  const label = editionLabel(state.catalog.edition);
  const current = state.orders.filter((o) => o.edition === label && o.status !== "zrusena");
  const boxesCount = current.reduce((s, o) => s + o.lines.reduce((x, l) => x + l.zeny + l.muzi, 0), 0);
  const revenue = current.reduce((s, o) => s + o.total, 0);
  const openLeads = state.leads.filter((l) => !l.handled).length;

  const stats = [
    { label: `Boxů v edici ${label}`, value: String(boxesCount) },
    { label: "Tržba edice bez DPH", value: formatPrice(revenue) },
    { label: "Nevyřízené poptávky", value: String(openLeads) },
  ];

  return (
    <>
      <AppBar title="Administrace" onLogout={logout} />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pt-8 sm:px-6">
        <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-medium leading-none">Administrace</h1>

        {state.storage === "memory" && (
          <Notice tone="warn">
            <b>Ukázkový režim:</b> databáze zatím není připojená, takže se změny po chvíli ztratí. Ve Vercelu otevřete
            Storage → Create Database → Upstash for Redis a připojte ji k projektu. Pak web znovu nasaďte.
          </Notice>
        )}

        <ul className="grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map((s) => (
            <li key={s.label} className="rounded-[22px] bg-white px-3 py-3 sm:rounded-[24px] sm:px-5 sm:py-4">
              <p className="font-display text-lg font-medium sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs leading-snug text-hlubina-2 sm:text-sm">{s.label}</p>
            </li>
          ))}
        </ul>

        <nav aria-label="Sekce administrace" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
          <div className="inline-flex gap-1.5 rounded-full bg-white p-1.5">
            {tabs.map(({ id, label: l, icon: Icon }) => {
              const sel = id === tab;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={sel}
                  onClick={() => setTab(id)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                    sel ? "bg-hlubina text-white" : "text-hlubina-2 hover:bg-mlha"
                  }`}
                >
                  <Icon size={17} aria-hidden="true" />
                  {l}
                  {id === "poptavky" && openLeads > 0 && (
                    <span className={`rounded-full px-2 text-xs ${sel ? "bg-white/20" : "bg-zlato text-ocean"}`}>{openLeads}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {tab === "edice" && <EditionTab catalog={state.catalog} run={run} />}
        {tab === "boxy" && <BoxesTab catalog={state.catalog} run={run} />}
        {tab === "objednavky" && <OrdersTab state={state} run={run} />}
        {tab === "klienti" && <ClientsTab state={state} run={run} />}
        {tab === "poptavky" && <LeadsTab leads={state.leads} run={run} />}
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
