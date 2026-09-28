import { NextResponse } from "next/server";

type Poptavka = {
  jmeno?: string;
  firma?: string;
  email?: string;
  pocet?: number | string;
  varianta?: string;
  zprava?: string;
};

export async function POST(request: Request) {
  let data: Poptavka;
  try {
    data = (await request.json()) as Poptavka;
  } catch {
    return NextResponse.json({ ok: false, error: "Neplatná data formuláře." }, { status: 400 });
  }

  const email = String(data.email ?? "").trim();
  if (!data.jmeno || !data.firma || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Vyplňte jméno, firmu a platný e-mail." },
      { status: 422 },
    );
  }

  // TODO: napojit na e-mail (např. Resend, SMTP) nebo CRM.
  // Zatím se poptávka jen vypíše do logu serveru.
  console.log("Nová poptávka Pauzeo:", data);

  return NextResponse.json({ ok: true });
}
