import { auth } from "@/lib/auth.server";
import { prisma } from "@/lib/prisma.server";
import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const t = initTRPC.context<Context>().create();

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    req,
    resHeaders,
    session,
    user: session?.user ?? null,
    prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
