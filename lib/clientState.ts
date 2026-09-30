import { publicClient } from "@/lib/sanitize";
import { getCatalog, getClients, getOrders } from "@/lib/store";

/** Data pro klientskou sekci: jen vlastní firma a její objednávky. */
export async function clientState(clientId: string) {
  const [catalog, clients, orders] = await Promise.all([getCatalog(), getClients(), getOrders()]);
  const client = clients.find((c) => c.id === clientId);
  if (!client) return null;
  return {
    client: publicClient(client),
    orders: orders.filter((o) => o.clientId === clientId),
    edition: catalog.edition,
    boxes: catalog.boxes.map((b) => ({ id: b.id, name: b.name, price: b.price })),
  };
}

export type ClientState = NonNullable<Awaited<ReturnType<typeof clientState>>>;
