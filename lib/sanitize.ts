import type { Client, PublicClient } from "@/lib/types";

/** Odstraní z klienta hash kódu, než se pošle do prohlížeče. */
export function publicClient(c: Client): PublicClient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { codeHash, codeSalt, ...rest } = c;
  return rest;
}
