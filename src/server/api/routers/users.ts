import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
  editName: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(256) }))
    .mutation(async ({ ctx, input }) => {
      const id = ctx.session.user.id;

      await ctx.db
        .update(users)
        .set({
          name: input.name,
        })
        .where(eq(users.id, id));
    }),
});
