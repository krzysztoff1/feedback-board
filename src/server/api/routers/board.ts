import { sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { boards } from "~/server/db/schema";

export const boardsRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(boards)
      .where(sql`"ownerId" = ${ctx.session?.user.id}`);
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const uid = ctx.session?.user.id;

      await ctx.db.insert(boards).values({
        name: input.name,
        ownerId: uid,
        createdById: uid,
      });
    }),
});
