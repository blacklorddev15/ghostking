import { initTRPC, TRPCError } from "@trpc/server";
import type { Express } from "express";
import type { User } from "./schema";
import superjson from "superjson";

export interface TrpcContext {
  user: User | null;
  req: any;
  res: any;
}

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
