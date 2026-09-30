import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, clearSession, isAdmin, setSession } from "@/lib/auth";
import { generateCode, hashCode, newId, safeEqual } from "@/lib/crypto";
import { editionLabel } from "@/lib/labels";
import { adminState as state } from "@/lib/adminState";
import {
  getCatalog,
  getClients,
  getLeads,
  getOrders,
  nextOrderNumber,
  saveCatalog,
  saveClients,
  saveLeads,
  saveOrders,
} from "@/lib/store";
import type { Client, Order, OrderLine, OrderStatus, VariantId } from "@/lib/types";
import { catalog as validCatalog, clean } from "@/lib/validate";

const STATUSES: OrderStatus[] = ["nova", "potvrzena", "zaplacena", "baleni", "odeslana", "dorucena", "zrusena"];
const VARIANTS: VariantId[] = ["kapka", "vlna", "ocean"];

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


function lines(raw: unknown): OrderLine[] {
  const arr = Array.isArray(raw) ? raw : [];
  return VARIANTS.map((variant) => {
    const l = arr.find((x) => x?.variant === variant) ?? {};
    const n = (v: unknown) => Math.max(0, Math.min(10000, Math.round(Number(v) || 0)));
    return { variant, zeny: n(l.zeny), muzi: n(l.muzi) };
  }).filter((l) => l.zeny + l.muzi > 0);
}

async function total(ls: OrderLine[]) {
  const cat = await getCatalog();
  return ls.reduce((sum, l) => sum + (l.zeny + l.muzi) * (cat.boxes.find((b) => b.id === l.variant)?.price ?? 0), 0);
}

function clientFields(raw: Record<string, unknown>) {
  return {
    company: clean(raw.company, 120),
    ico: clean(raw.ico, 20),
    dic: clean(raw.dic, 20),
    street: clean(raw.street, 120),
    city: clean(raw.city, 80),
    zip: clean(raw.zip, 12),
    contactName: clean(raw.contactName, 100),
    email: clean(raw.email, 120).toLowerCase(),
    phone: clean(raw.phone, 30),
    delivery: raw.delivery === "domu" ? ("domu" as const) : ("kancelar" as const),
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("Neplatný požadavek.");
  }
  const action = String(body.action ?? "");

  /* --- přihlášení --- */
  if (action === "login") {
    const pass = process.env.ADMIN_PASSWORD;
    if (!pass) return fail("Administrace zatím není nastavená. Přidejte ve Vercelu proměnnou ADMIN_PASSWORD.", 503);
    if (!safeEqual(String(body.password ?? ""), pass)) {
      await sleep(700);
      return fail("Nesprávné heslo.", 401);
    }
    const res = NextResponse.json({ ok: true });
    setSession(res, ADMIN_COOKIE, "admin", "admin");
    return res;
  }
  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    clearSession(res, ADMIN_COOKIE);
    return res;
  }

  if (!(await isAdmin())) return fail("Přihlášení vypršelo. Přihlaste se znovu.", 401);

  try {
    switch (action) {
      case "saveCatalog": {
        const current = await getCatalog();
        await saveCatalog(validCatalog(body.catalog, current));
        revalidatePath("/");
        break;
      }

      case "saveClient": {
        const raw = (body.client ?? {}) as Record<string, unknown>;
        const fields = clientFields(raw);
        if (!fields.company || !/^\S+@\S+\.\S+$/.test(fields.email)) return fail("Vyplňte název firmy a platný e-mail.");
        const clients = await getClients();
        if (clients.some((c) => c.email === fields.email && c.id !== raw.id)) return fail("Klient s tímto e-mailem už existuje.");
        const existing = clients.find((c) => c.id === raw.id);
        if (existing) {
          Object.assign(existing, fields);
          await saveClients(clients);
          break;
        }
        const code = generateCode();
        const { hash, salt } = hashCode(code);
        const client: Client = { id: newId("c-"), ...fields, codeHash: hash, codeSalt: salt, createdAt: new Date().toISOString() };
        clients.push(client);
        await saveClients(clients);
        return NextResponse.json({ ok: true, code, ...(await state()) });
      }

      case "resetCode": {
        const clients = await getClients();
        const c = clients.find((x) => x.id === body.id);
        if (!c) return fail("Klient nenalezen.", 404);
        const code = generateCode();
        const { hash, salt } = hashCode(code);
        c.codeHash = hash;
        c.codeSalt = salt;
        await saveClients(clients);
        return NextResponse.json({ ok: true, code, ...(await state()) });
      }

      case "deleteClient": {
        const clients = await getClients();
        await saveClients(clients.filter((c) => c.id !== body.id));
        break;
      }

      case "saveOrder": {
        const raw = (body.order ?? {}) as Record<string, unknown>;
        const orders = await getOrders();
        const status = STATUSES.includes(raw.status as OrderStatus) ? (raw.status as OrderStatus) : "nova";
        const existing = orders.find((o) => o.id === raw.id);
        if (existing) {
          existing.status = status;
          existing.note = clean(raw.note, 500);
          if (raw.lines) {
            existing.lines = lines(raw.lines);
            existing.total = await total(existing.lines);
          }
          if (raw.edition) existing.edition = clean(raw.edition, 60);
          await saveOrders(orders);
          break;
        }
        const clients = await getClients();
        if (!clients.some((c) => c.id === raw.clientId)) return fail("Vyberte klienta.");
        const ls = lines(raw.lines);
        if (!ls.length) return fail("Zadejte počet boxů alespoň u jedné varianty.");
        const cat = await getCatalog();
        const order: Order = {
          id: newId("o-"),
          number: nextOrderNumber(orders),
          clientId: String(raw.clientId),
          edition: clean(raw.edition, 60) || editionLabel(cat.edition),
          createdAt: new Date().toISOString(),
          lines: ls,
          total: await total(ls),
          status,
          note: clean(raw.note, 500),
        };
        orders.unshift(order);
        await saveOrders(orders);
        break;
      }

      case "deleteOrder": {
        const orders = await getOrders();
        await saveOrders(orders.filter((o) => o.id !== body.id));
        break;
      }

      case "toggleLead": {
        const leads = await getLeads();
        const l = leads.find((x) => x.id === body.id);
        if (l) l.handled = !l.handled;
        await saveLeads(leads);
        break;
      }

      case "deleteLead": {
        const leads = await getLeads();
        await saveLeads(leads.filter((l) => l.id !== body.id));
        break;
      }

      default:
        return fail("Neznámá akce.");
    }
  } catch (err) {
    console.error("Admin akce selhala:", action, err);
    return fail("Uložení se nepodařilo. Zkuste to prosím znovu.", 500);
  }

  return NextResponse.json({ ok: true, ...(await state()) });
}
