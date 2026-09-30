/**
 * Úložiště dat: Google Firebase (Cloud Firestore).
 *
 * Přihlašovací údaje servisního účtu (Vercel → Environment Variables), jedna z variant:
 *  - FIREBASE_SERVICE_ACCOUNT = celý JSON klíč (nebo jeho base64)
 *  - FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *
 * Struktura ve Firestore:
 *  settings/catalog      – boxy, produkty a aktuální edice
 *  clients/{id}          – klienti
 *  orders/{id}           – objednávky
 *  leads/{id}            – poptávky z webu
 *
 * Bez údajů běží ukázkový režim v paměti serveru (změny se po restartu ztratí).
 */
import type { Firestore } from "firebase-admin/firestore";
import { hashCode } from "@/lib/crypto";
import { demoClient, demoOrders, seedCatalog } from "@/lib/seed";
import type { Catalog, Client, Lead, Order } from "@/lib/types";

type Collection = "clients" | "orders" | "leads";

function firebaseConfig() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (raw) {
    try {
      const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
      const sa = JSON.parse(json) as { project_id: string; client_email: string; private_key: string };
      return { projectId: sa.project_id, clientEmail: sa.client_email, privateKey: sa.private_key };
    } catch (err) {
      console.error("FIREBASE_SERVICE_ACCOUNT nelze přečíst:", err);
    }
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return projectId && clientEmail && privateKey ? { projectId, clientEmail, privateKey } : null;
}

export const storageMode = (): "firebase" | "memory" => (firebaseConfig() ? "firebase" : "memory");

let db: Firestore | null = null;

async function firestore(): Promise<Firestore | null> {
  if (db) return db;
  const cfg = firebaseConfig();
  if (!cfg) return null;
  const { cert, getApps, initializeApp } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  const app = getApps().find((a) => a.name === "pauzeo") ?? initializeApp({ credential: cert(cfg) }, "pauzeo");
  db = getFirestore(app);
  try {
    db.settings({ ignoreUndefinedProperties: true });
  } catch {
    // nastavení lze zavolat jen jednou
  }
  return db;
}

/* --- ukázkový režim v paměti --- */
type Memory = { catalog: Catalog; clients: Client[]; orders: Order[]; leads: Lead[] };
const g = globalThis as unknown as { __pauzeo?: Memory };
function memory(): Memory {
  if (!g.__pauzeo) {
    const { hash, salt } = hashCode("demo2026");
    g.__pauzeo = {
      catalog: structuredClone(seedCatalog),
      clients: [demoClient(hash, salt)],
      orders: structuredClone(demoOrders),
      leads: [],
    };
  }
  return g.__pauzeo;
}

/* --- obecné čtení a zápis kolekcí --- */
async function readList<T extends { createdAt: string }>(name: Collection, desc = true): Promise<T[]> {
  const fs = await firestore();
  const list = fs
    ? (await fs.collection(name).get()).docs.map((d) => d.data() as T)
    : (structuredClone(memory()[name]) as unknown as T[]);
  return list.sort((a, b) => (desc ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)));
}

async function writeList<T extends { id: string }>(name: Collection, list: T[]) {
  const fs = await firestore();
  if (!fs) {
    (memory() as unknown as Record<Collection, T[]>)[name] = structuredClone(list);
    return;
  }
  const col = fs.collection(name);
  const existing = await col.listDocuments();
  const keep = new Set(list.map((x) => x.id));
  const ops: Array<(b: FirebaseFirestore.WriteBatch) => void> = [
    ...list.map((item) => (b: FirebaseFirestore.WriteBatch) => b.set(col.doc(item.id), item)),
    ...existing.filter((ref) => !keep.has(ref.id)).map((ref) => (b: FirebaseFirestore.WriteBatch) => b.delete(ref)),
  ];
  for (let i = 0; i < ops.length; i += 400) {
    const batch = fs.batch();
    ops.slice(i, i + 400).forEach((op) => op(batch));
    await batch.commit();
  }
}

/* --- veřejné funkce --- */

export async function getCatalog(): Promise<Catalog> {
  try {
    const fs = await firestore();
    const c = fs ? ((await fs.doc("settings/catalog").get()).data() as Catalog | undefined) : structuredClone(memory().catalog);
    return c?.boxes?.length === 3 && c.edition ? c : structuredClone(seedCatalog);
  } catch (err) {
    console.error("Načtení katalogu selhalo, používám výchozí:", err);
    return structuredClone(seedCatalog);
  }
}

export async function saveCatalog(c: Catalog) {
  const fs = await firestore();
  if (fs) await fs.doc("settings/catalog").set(c);
  else memory().catalog = structuredClone(c);
}

export const getClients = () => readList<Client>("clients", false);
export const saveClients = (list: Client[]) => writeList("clients", list);

export const getOrders = () => readList<Order>("orders");
export const saveOrders = (list: Order[]) => writeList("orders", list);

export const getLeads = () => readList<Lead>("leads");
export const saveLeads = (list: Lead[]) => writeList("leads", list);

/** Další číslo objednávky ve tvaru PZ-2026-023. */
export function nextOrderNumber(orders: Order[]) {
  const year = new Date().getFullYear();
  const prefix = `PZ-${year}-`;
  const max = orders
    .filter((o) => o.number.startsWith(prefix))
    .reduce((m, o) => Math.max(m, Number(o.number.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}
