import { TRPCError } from "@trpc/server";
import { t } from "./context";
import type { AppRouter } from "./router";

export type { AppRouter };
export const router = t.router;
export const procedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
