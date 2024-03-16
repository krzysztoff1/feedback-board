import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { suggestions, users } from "~/server/db/schema";

export const suggestionsRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        boardId: z.number(),
        page: z.number(),
        offset: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const PAGE_SIZE = 10;

      return await ctx.db
        .select()
        .from(suggestions)
        .leftJoin(users, eq(suggestions.createdBy, users.id))
        .orderBy(desc(suggestions.createdAt))
        .where(eq(suggestions.boardId, input.boardId))
        .limit(PAGE_SIZE)
        .offset(input.page * PAGE_SIZE);
    }),
  create: protectedProcedure
    .input(
      z.object({
        boardId: z.number(),
        content: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const uid = ctx.session.user.id;

      await ctx.db.insert(suggestions).values({
        boardId: input.boardId,
        content: input.content,
        title: input.title,
        createdBy: uid,
      });
    }),
});
