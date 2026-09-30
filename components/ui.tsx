"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { APP_VERSION } from "@/lib/version";

export const inputCls =
  "w-full rounded-2xl border-2 border-hlubina/10 bg-white px-4 py-3 text-base text-hlubina placeholder:text-hlubina-2/60 transition-colors focus:border-vlna focus:outline-none disabled:bg-mlha";

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="pl-1 text-sm font-semibold text-hlubina-2">{label}</span>
      {children}
      {hint && <span className="pl-1 text-xs text-hlubina-2">{hint}</span>}
    </label>
  );
}

export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={`${inputCls} ${p.className ?? ""}`} />;

export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className={`${inputCls} min-h-[88px] ${p.className ?? ""}`} />
);

export function Select({ children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select {...p} className={`${inputCls} appearance-none pr-10 ${p.className ?? ""}`}>
        {children}
      </select>
      <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-hlubina-2" />
    </span>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "secondary" | "danger" | "ghost" };

export function Button({ tone = "primary", className = "", ...p }: BtnProps) {
  const tones = {
    primary: "bg-hlubina text-white hover:bg-vlna",
    secondary: "bg-white text-hlubina border-2 border-hlubina/10 hover:border-hlubina/30",
    danger: "bg-white text-[#9b2c1f] border-2 border-[#9b2c1f]/20 hover:border-[#9b2c1f]/50",
    ghost: "bg-transparent text-hlubina-2 hover:bg-white",
  };
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition-colors active:scale-[0.98] disabled:opacity-60 ${tones[tone]} ${className}`}
    />
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[28px] bg-white p-5 sm:p-7 ${className}`}>{children}</div>;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "ok" | "error"; children: ReactNode }) {
  const tones = {
    info: "bg-[#dce9ec] text-[#16323d]",
    warn: "bg-[#f3e7c9] text-[#4a3a12]",
    ok: "bg-[#e3ecd9] text-[#26401f]",
    error: "bg-[#f6dcd6] text-[#6b1f14]",
  };
  return <div className={`rounded-[22px] px-5 py-4 text-[15px] leading-relaxed ${tones[tone]}`}>{children}</div>;
}

/** Horní lišta pro /admin a /klient. */
export function AppBar({ title, onLogout }: { title: string; onLogout?: () => void }) {
  return (
    <header className="sticky top-3 z-40 px-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-hlubina/10 bg-white/85 py-2 pl-5 pr-2 shadow-[0_8px_30px_rgba(15,42,54,0.08)] backdrop-blur-md">
        <a href="/" className="flex items-center gap-3 text-vlna" aria-label="Zpět na web Pauzeo">
          <Logo size={19} />
          <span className="hidden rounded-full bg-mlha px-3 py-1 text-xs font-semibold text-hlubina-2 sm:inline">{title}</span>
        </a>
        {onLogout ? (
          <Button tone="ghost" onClick={onLogout} className="px-4 py-2.5">
            <LogOut size={17} aria-hidden="true" />
            Odhlásit
          </Button>
        ) : (
          <span className="pr-4 text-sm font-semibold text-hlubina-2 sm:hidden">{title}</span>
        )}
      </div>
    </header>
  );
}

export function AppFooter() {
  return <p className="py-10 text-center text-xs text-hlubina-2/70">© {new Date().getFullYear()} Pauzeo v{APP_VERSION}</p>;
}

/** Volání API s akcí; vrací JSON nebo vyhodí chybu s hláškou. */
export async function callApi<T>(url: string, action: string, payload: Record<string, unknown> = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
  } catch {
    throw new Error("Nepodařilo se spojit se serverem. Zkontrolujte připojení.");
  }
  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !json.ok) throw new Error(json.error ?? "Něco se nepovedlo.");
  return json as T;
}
