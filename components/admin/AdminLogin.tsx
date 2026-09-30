"use client";

import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { AppBar, AppFooter, Button, Card, Field, Input, Notice, callApi } from "@/components/ui";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await callApi("/api/admin", "login", { password: new FormData(e.currentTarget).get("password") });
      window.location.reload();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <>
      <AppBar title="Administrace" />
      <main className="mx-auto flex max-w-md flex-col gap-5 px-4 pt-16">
        <Card>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mlha text-vlna">
            <Lock size={24} aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-4xl font-medium">Administrace</h1>
          <p className="mt-2 text-hlubina-2">Přihlaste se heslem správce.</p>
          {!configured && (
            <div className="mt-5">
              <Notice tone="warn">
                Heslo zatím není nastavené. Ve Vercelu přidejte proměnnou <b>ADMIN_PASSWORD</b> (Settings → Environment
                Variables) a projekt znovu nasaďte.
              </Notice>
            </div>
          )}
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <Field label="Heslo">
              <Input name="password" type="password" autoComplete="current-password" required disabled={!configured} />
            </Field>
            {error && <Notice tone="error">{error}</Notice>}
            <Button type="submit" disabled={busy || !configured}>
              {busy ? "Přihlašuji…" : "Přihlásit"}
            </Button>
          </form>
        </Card>
      </main>
      <AppFooter />
    </>
  );
}
