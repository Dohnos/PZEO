import { NextResponse } from "next/server";
import { newId } from "@/lib/crypto";
import { getLeads, saveLeads } from "@/lib/store";
import { clean } from "@/lib/validate";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Neplatná data formuláře." }, { status: 400 });
  }

  const email = clean(data.email, 120);
  if (!clean(data.jmeno) || !clean(data.firma) || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Vyplňte jméno, firmu a platný e-mail." }, { status: 422 });
  }

  try {
    const leads = await getLeads();
    leads.unshift({
      id: newId("l-"),
      createdAt: new Date().toISOString(),
      jmeno: clean(data.jmeno, 100),
      firma: clean(data.firma, 120),
      email,
      pocet: clean(data.pocet, 10),
      varianta: clean(data.varianta, 20),
      zprava: clean(data.zprava, 2000),
      handled: false,
    });
    await saveLeads(leads.slice(0, 500));
  } catch (err) {
    console.error("Uložení poptávky selhalo:", err);
    return NextResponse.json({ ok: false, error: "Poptávku se nepodařilo uložit. Zkuste to prosím znovu." }, { status: 500 });
  }

  // TODO: e-mailové upozornění (např. Resend)
  return NextResponse.json({ ok: true });
}
