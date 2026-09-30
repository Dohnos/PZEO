"use client";

import { useState, type FormEvent } from "react";
import { Building2 } from "lucide-react";
import { AppBar, AppFooter, Button, Card, Field, Input, Notice, callApi } from "@/components/ui";

export function ClientLogin({ demo }: { demo: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      await callApi("/api/klient", "login", { email: f.get("email"), code: f.get("code") });
      window.location.reload();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <>
      <AppBar title="Klientská sekce" />
      <main className="mx-auto flex max-w-md flex-col gap-5 px-4 pt-16">
        <Card>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mlha text-vlna">
            <Building2 size={24} aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-4xl font-medium">Klientská sekce</h1>
          <p className="mt-2 text-hlubina-2">Objednávky, jejich stav a údaje o vaší firmě na jednom místě.</p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <Field label="Pracovní e-mail">
              <Input name="email" type="email" autoComplete="email" required />
            </Field>
            <Field label="Přístupový kód" hint="Kód vám pošleme při založení spolupráce.">
              <Input name="code" autoComplete="one-time-code" autoCapitalize="none" required />
            </Field>
            {error && <Notice tone="error">{error}</Notice>}
            <Button type="submit" disabled={busy}>
              {busy ? "Přihlašuji…" : "Přihlásit"}
            </Button>
          </form>
        </Card>
        {demo && (
          <Notice tone="info">
            <b>Ukázka:</b> e-mail <b>demo@pauzeo.cz</b>, kód <b>demo2026</b>
          </Notice>
        )}
      </main>
      <AppFooter />
    </>
  );
}
