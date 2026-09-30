/**
 * Úložiště dat.
 * - Když jsou ve Vercelu nastavené proměnné Upstash Redis (KV_REST_API_URL + KV_REST_API_TOKEN,
 *   nebo UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN), data se ukládají natrvalo.
 * - Jinak běží ukázkový režim v paměti serveru (změny se po restartu ztratí).
 */
import { hashCode } from "@/lib/crypto";
import { demoClient, demoOrders, seedCatalog } from "@/lib/seed";
import type { Catalog, Client, Lead, Order } from "@/lib/types";

const KEYS = {
  catalog: "pauzeo:catalog",
  clients: "pauzeo:clients",
  orders: "pauzeo:orders",
  leads: "pauzeo:leads",
} as const;

type Key = (typeof KEYS)[keyof typeof KEYS];

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export const storageMode = (): "redis" | "memory" => (redisConfig() ? "redis" : "memory");

async function redis(command: string[]) {
  const cfg = redisConfig();
  if (!cfg) throw new Error("Redis není nastavený");
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (!res.ok || json.error) throw new Error(json.error ?? `Redis ${res.status}`);
  return json.result;
}

/* --- paměťový režim --- */
const g = globalThis as unknown as { __pauzeo?: Partial<Record<Key, unknown>> };
function memory() {
  if (!g.__pauzeo) {
    const { hash, salt } = hashCode("demo2026");
    g.__pauzeo = {
      [KEYS.catalog]: structuredClone(seedCatalog),
      [KEYS.clients]: [demoClient(hash, salt)],
      [KEYS.orders]: structuredClone(demoOrders),
      [KEYS.leads]: [],
    };
  }
  return g.__pauzeo;
}

async function read<T>(key: Key, fallback: () => T): Promise<T> {
  if (redisConfig()) {
    const raw = await redis(["GET", key]);
    return typeof raw === "string" ? (JSON.parse(raw) as T) : fallback();
  }
  return (memory()[key] as T | undefined) ?? fallback();
}

async function write<T>(key: Key, value: T) {
  if (redisConfig()) {
    await redis(["SET", key, JSON.stringify(value)]);
    return;
  }
  memory()[key] = structuredClone(value);
}

/* --- veřejné funkce --- */

export async function getCatalog(): Promise<Catalog> {
  try {
    const c = await read<Catalog>(KEYS.catalog, () => structuredClone(seedCatalog));
    return c?.boxes?.length === 3 && c.edition ? c : structuredClone(seedCatalog);
  } catch (err) {
    console.error("Načtení katalogu selhalo, používám výchozí:", err);
    return structuredClone(seedCatalog);
  }
}
export const saveCatalog = (c: Catalog) => write(KEYS.catalog, c);

export const getClients = () => read<Client[]>(KEYS.clients, () => []);
export const saveClients = (list: Client[]) => write(KEYS.clients, list);

export const getOrders = () => read<Order[]>(KEYS.orders, () => []);
export const saveOrders = (list: Order[]) => write(KEYS.orders, list);

export const getLeads = () => read<Lead[]>(KEYS.leads, () => []);
export const saveLeads = (list: Lead[]) => write(KEYS.leads, list);

/** Další číslo objednávky ve tvaru PZ-2026-023. */
export function nextOrderNumber(orders: Order[]) {
  const year = new Date().getFullYear();
  const prefix = `PZ-${year}-`;
  const max = orders
    .filter((o) => o.number.startsWith(prefix))
    .reduce((m, o) => Math.max(m, Number(o.number.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}
