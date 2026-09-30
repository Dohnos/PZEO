import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/** Tajemství pro podpis přihlašovacích cookies. */
function secret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.ADMIN_PASSWORD) return `pauzeo:${process.env.ADMIN_PASSWORD}`;
  return "pauzeo-dev-secret";
}

export const newId = (prefix = "") => `${prefix}${randomBytes(6).toString("hex")}`;

/** Přístupový kód pro klienta, bez zaměnitelných znaků (0/O, 1/l). */
export function generateCode(length = 8) {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function hashCode(code: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(code.trim().toLowerCase(), salt, 32).toString("hex");
  return { hash, salt };
}

export function verifyCode(code: string, hash: string, salt: string) {
  if (!hash || !salt) return false;
  const test = Buffer.from(hashCode(code, salt).hash, "hex");
  const real = Buffer.from(hash, "hex");
  return test.length === real.length && timingSafeEqual(test, real);
}

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

type Payload = { role: "admin" | "client"; id: string; exp: number };

export function signToken(payload: Payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string | undefined): Payload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    return p.exp > Date.now() ? p : null;
  } catch {
    return null;
  }
}
