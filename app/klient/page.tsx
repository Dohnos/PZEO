import type { Metadata } from "next";
import { ClientLogin } from "@/components/klient/ClientLogin";
import { ClientPortal } from "@/components/klient/ClientPortal";
import { getClientId } from "@/lib/auth";
import { clientState } from "@/lib/clientState";
import { storageMode } from "@/lib/store";

export const metadata: Metadata = {
  title: "Klientská sekce | Pauzeo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function KlientPage() {
  const id = await getClientId();
  const state = id ? await clientState(id) : null;
  if (!state) return <ClientLogin demo={storageMode() === "memory"} />;
  return <ClientPortal initial={state} />;
}
