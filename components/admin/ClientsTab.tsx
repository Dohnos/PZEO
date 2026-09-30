"use client";

import { useState } from "react";
import { Copy, KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import type { Run } from "@/components/admin/AdminApp";
import { Button, Card, Field, Input, Notice, Select } from "@/components/ui";
import type { AdminState } from "@/lib/adminState";
import type { PublicClient } from "@/lib/types";

type Form = Omit<PublicClient, "id" | "createdAt"> & { id?: string };

const blank: Form = {
  company: "",
  ico: "",
  dic: "",
  street: "",
  city: "",
  zip: "",
  contactName: "",
  email: "",
  phone: "",
  delivery: "kancelar",
};

export function ClientForm({ value, onChange }: { value: Form; onChange: (f: Form) => void }) {
  const set = (k: keyof Form, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Název firmy" className="sm:col-span-2">
        <Input value={value.company} onChange={(e) => set("company", e.target.value)} required />
      </Field>
      <Field label="IČO">
        <Input value={value.ico} onChange={(e) => set("ico", e.target.value)} inputMode="numeric" />
      </Field>
      <Field label="DIČ">
        <Input value={value.dic} onChange={(e) => set("dic", e.target.value)} />
      </Field>
      <Field label="Ulice a číslo" className="sm:col-span-2">
        <Input value={value.street} onChange={(e) => set("street", e.target.value)} autoComplete="street-address" />
      </Field>
      <Field label="Město">
        <Input value={value.city} onChange={(e) => set("city", e.target.value)} />
      </Field>
      <Field label="PSČ">
        <Input value={value.zip} onChange={(e) => set("zip", e.target.value)} inputMode="numeric" />
      </Field>
      <Field label="Kontaktní osoba">
        <Input value={value.contactName} onChange={(e) => set("contactName", e.target.value)} />
      </Field>
      <Field label="Telefon">
        <Input value={value.phone} onChange={(e) => set("phone", e.target.value)} type="tel" />
      </Field>
      <Field label="E-mail (přihlášení)" className="sm:col-span-2">
        <Input value={value.email} onChange={(e) => set("email", e.target.value)} type="email" />
      </Field>
      <Field label="Doručení boxů" className="sm:col-span-2">
        <Select value={value.delivery} onChange={(e) => set("delivery", e.target.value)}>
          <option value="kancelar">Hromadně do kanceláře</option>
          <option value="domu">Každému zaměstnanci domů</option>
        </Select>
      </Field>
    </div>
  );
}

export function ClientsTab({ state, run }: { state: AdminState; run: Run }) {
  const [form, setForm] = useState<Form | null>(null);
  const [code, setCode] = useState<{ company: string; email: string; code: string } | null>(null);

  const save = async () => {
    if (!form) return;
    const res = await run("saveClient", { client: form }, form.id ? "Klient uložen." : "Klient přidán.");
    if (res) {
      if (typeof res.code === "string") setCode({ company: form.company, email: form.email, code: res.code });
      setForm(null);
    }
  };

  const reset = async (c: PublicClient) => {
    if (!window.confirm(`Vygenerovat nový přístupový kód pro ${c.company}? Starý přestane platit.`)) return;
    const res = await run("resetCode", { id: c.id }, "Nový kód vygenerován.");
    if (res && typeof res.code === "string") setCode({ company: c.company, email: c.email, code: res.code });
  };

  const ordersOf = (id: string) => state.orders.filter((o) => o.clientId === id).length;

  return (
    <div className="flex flex-col gap-5">
      {code && (
        <Notice tone="ok">
          <p>
            <b>Přístup pro {code.company}</b> (zobrazí se jen teď, uložte si ho):
          </p>
          <p className="mt-2">E-mail: {code.email}</p>
          <p className="mt-1 flex flex-wrap items-center gap-3">
            Kód: <b className="font-mono text-xl tracking-wider">{code.code}</b>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(`Přihlášení: ${location.origin}/klient\nE-mail: ${code.email}\nKód: ${code.code}`)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold"
            >
              <Copy size={15} aria-hidden="true" /> Kopírovat přístup
            </button>
          </p>
        </Notice>
      )}

      {form ? (
        <Card>
          <h2 className="font-display text-2xl font-medium">{form.id ? "Upravit klienta" : "Nový klient"}</h2>
          <div className="mt-5">
            <ClientForm value={form} onChange={setForm} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={save}>{form.id ? "Uložit změny" : "Přidat a vygenerovat kód"}</Button>
            <Button tone="secondary" onClick={() => setForm(null)}>
              Zrušit
            </Button>
          </div>
        </Card>
      ) : (
        <div>
          <Button onClick={() => setForm({ ...blank })}>
            <Plus size={18} aria-hidden="true" /> Přidat klienta
          </Button>
        </div>
      )}

      {state.clients.length === 0 ? (
        <Card>
          <p className="text-hlubina-2">Zatím žádní klienti.</p>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {state.clients.map((c) => (
            <li key={c.id}>
              <Card className="!p-5">
                <p className="text-lg font-semibold">{c.company}</p>
                <p className="text-hlubina-2">
                  {c.contactName}
                  {c.contactName && c.email ? ", " : ""}
                  {c.email}
                </p>
                <p className="mt-1 text-sm text-hlubina-2">
                  Objednávek: {ordersOf(c.id)}, doručení {c.delivery === "domu" ? "domů" : "do kanceláře"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button tone="secondary" className="px-4 py-2.5" onClick={() => setForm({ ...c })}>
                    <Pencil size={16} aria-hidden="true" /> Upravit
                  </Button>
                  <Button tone="secondary" className="px-4 py-2.5" onClick={() => reset(c)}>
                    <KeyRound size={16} aria-hidden="true" /> Nový kód
                  </Button>
                  <Button
                    tone="danger"
                    className="px-4 py-2.5"
                    aria-label={`Smazat klienta ${c.company}`}
                    onClick={() => {
                      if (window.confirm(`Opravdu smazat klienta ${c.company}? Objednávky zůstanou.`)) run("deleteClient", { id: c.id }, "Klient smazán.");
                    }}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
