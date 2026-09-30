import { NextResponse } from "next/server";
import { CLIENT_COOKIE, clearSession, getClientId, setSession } from "@/lib/auth";
import { clientState } from "@/lib/clientState";
import { newId, verifyCode } from "@/lib/crypto";
import { editionLabel } from "@/lib/labels";
import { getCatalog, getClients, getOrders, nextOrderNumber, saveClients, saveOrders } from "@/lib/store";
import type { OrderLine, VariantId } from "@/lib/types";
import { clean } from "@/lib/validate";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const VARIANTS: VariantId[] = ["kapka", "vlna", "ocean"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("Neplatný požadavek.");
  }
  const action = String(body.action ?? "");

  if (action === "login") {
    const email = clean(body.email, 120).toLowerCase();
    const code = clean(body.code, 40);
    const clients = await getClients();
    const c = clients.find((x) => x.email === email);
    if (!c || !verifyCode(code, c.codeHash, c.codeSalt)) {
      await sleep(700);
      return fail("E-mail nebo přístupový kód nesedí.", 401);
    }
    const res = NextResponse.json({ ok: true });
    setSession(res, CLIENT_COOKIE, "client", c.id);
    return res;
  }

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    clearSession(res, CLIENT_COOKIE);
    return res;
  }

  const clientId = await getClientId();
  if (!clientId) return fail("Přihlášení vypršelo. Přihlaste se znovu.", 401);

  try {
    if (action === "updateProfile") {
      const raw = (body.profile ?? {}) as Record<string, unknown>;
      const clients = await getClients();
      const c = clients.find((x) => x.id === clientId);
      if (!c) return fail("Účet nenalezen.", 404);
      c.company = clean(raw.company, 120) || c.company;
      c.ico = clean(raw.ico, 20);
      c.dic = clean(raw.dic, 20);
      c.street = clean(raw.street, 120);
      c.city = clean(raw.city, 80);
      c.zip = clean(raw.zip, 12);
      c.contactName = clean(raw.contactName, 100);
      c.phone = clean(raw.phone, 30);
      c.delivery = raw.delivery === "domu" ? "domu" : "kancelar";
      await saveClients(clients);
    } else if (action === "order") {
      const cat = await getCatalog();
      if (!cat.edition.open) return fail("Objednávky na aktuální edici jsou uzavřené.");
      const label = editionLabel(cat.edition);
      const arr = Array.isArray(body.lines) ? (body.lines as Record<string, unknown>[]) : [];
      const n = (v: unknown) => Math.max(0, Math.min(10000, Math.round(Number(v) || 0)));
      const ls: OrderLine[] = VARIANTS.map((variant) => {
        const l = arr.find((x) => x?.variant === variant) ?? {};
        return { variant, zeny: n(l.zeny), muzi: n(l.muzi) };
      }).filter((l) => l.zeny + l.muzi > 0);
      const count = ls.reduce((s, l) => s + l.zeny + l.muzi, 0);
      if (count < 10) return fail("Minimální objednávka je 10 boxů.");
      const total = ls.reduce((s, l) => s + (l.zeny + l.muzi) * (cat.boxes.find((b) => b.id === l.variant)?.price ?? 0), 0);

      const orders = await getOrders();
      const existing = orders.find((o) => o.clientId === clientId && o.edition === label && o.status !== "zrusena");
      if (existing && existing.status !== "nova") {
        return fail("Objednávka na tuto edici už je potvrzená. Změny prosím pošlete e-mailem.");
      }
      if (existing) {
        existing.lines = ls;
        existing.total = total;
        existing.note = clean(body.note, 500);
      } else {
        orders.unshift({
          id: newId("o-"),
          number: nextOrderNumber(orders),
          clientId,
          edition: label,
          createdAt: new Date().toISOString(),
          lines: ls,
          total,
          status: "nova",
          note: clean(body.note, 500),
        });
      }
      await saveOrders(orders);
    } else {
      return fail("Neznámá akce.");
    }
  } catch (err) {
    console.error("Klientská akce selhala:", action, err);
    return fail("Uložení se nepodařilo. Zkuste to prosím znovu.", 500);
  }

  return NextResponse.json({ ok: true, state: await clientState(clientId) });
}
