import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { boards } from "~/server/db/schema";

export const boardsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    const uid = ctx.session.user.id;
    return ctx.db.select().from(boards).where(eq(boards.ownerId, uid));
  }),
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const uid = ctx.session.user.id;

      return ctx.db.query.boards.findFirst({
        where(fields, operators) {
          return and(
            operators.eq(fields.id, input.id),
            operators.eq(fields.ownerId, uid),
          );
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const uid = ctx.session.user.id;

      await ctx.db.insert(boards).values({
        createdById: uid,
        ownerId: uid,
        name: input.name,
      });
    }),
});
