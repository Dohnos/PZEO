import { publicClient } from "@/lib/sanitize";
import { getCatalog, getClients, getLeads, getOrders, storageMode } from "@/lib/store";

/** Kompletní data pro administraci (bez citlivých polí). */
export async function adminState() {
  const [catalog, clients, orders, leads] = await Promise.all([getCatalog(), getClients(), getOrders(), getLeads()]);
  return { catalog, clients: clients.map(publicClient), orders, leads, storage: storageMode() };
}

export type AdminState = Awaited<ReturnType<typeof adminState>>;
