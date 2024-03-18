import { and, eq, count, desc } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  boards,
  suggestions,
  suggestionsUpVotes,
  users,
} from "~/server/db/schema";

export const suggestionsRouter = createTRPCRouter({
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
  checkUpVote: protectedProcedure
    .input(
      z.object({
        boardId: z.number(),
        suggestionId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const uid = ctx.session.user.id;

      return ctx.db.query.suggestionsUpVotes.findFirst({
        where(fields, operators) {
          return and(
            operators.eq(fields.boardId, input.boardId),
            operators.eq(fields.suggestionId, input.suggestionId),
            operators.eq(fields.userId, uid),
          );
        },
      });
    }),
  getAll: protectedProcedure
    .input(z.object({ slug: z.string(), page: z.number() }))
    .query(async ({ input, ctx }) => {
      const PAGE_SIZE = 20;
      const uid = ctx.session.user.id;
      const board = await ctx.db.query.boards.findFirst({
        where(fields) {
          return eq(fields.slug, input.slug);
        },
      });
      const boardId = board?.id ?? -1;

      if (!board || board.createdById !== uid) {
        return [];
      }

      const res = await ctx.db
        .select()
        .from(suggestions)
        .leftJoin(users, eq(suggestions.createdBy, users.id))
        .orderBy(desc(suggestions.createdAt))
        .where(eq(suggestions.boardId, boardId))
        .limit(PAGE_SIZE)
        .offset(input.page * PAGE_SIZE);

      return res.map(({ suggestions, user }) => ({
        id: suggestions.id,
        title: suggestions.title,
        content: suggestions.content,
        upVotes: suggestions.upVotes,
        user: {
          id: user?.id,
          name: user?.name,
          image: user?.image,
        },
      }));
    }),
  toggleUpVote: protectedProcedure
    .input(
      z.object({
        boardId: z.number(),
        suggestionId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const uid = ctx.session.user.id;
      const isAlreadyUpVoted = await ctx.db.query.suggestionsUpVotes.findFirst({
        where(fields, operators) {
          return and(
            operators.eq(fields.boardId, input.boardId),
            operators.eq(fields.suggestionId, input.suggestionId),
            operators.eq(fields.userId, uid),
          );
        },
      });

      if (isAlreadyUpVoted) {
        await ctx.db
          .delete(suggestionsUpVotes)
          .where(
            and(
              eq(suggestionsUpVotes.boardId, input.boardId),
              eq(suggestionsUpVotes.suggestionId, input.suggestionId),
              eq(suggestionsUpVotes.userId, uid),
            ),
          );
      } else {
        await ctx.db.insert(suggestionsUpVotes).values({
          boardId: input.boardId,
          suggestionId: input.suggestionId,
          userId: uid,
        });
      }

      const newCount = await ctx.db
        .select({ _count: count(suggestionsUpVotes.id) })
        .from(suggestionsUpVotes)
        .where(
          and(
            eq(suggestionsUpVotes.suggestionId, input.suggestionId),
            eq(suggestionsUpVotes.boardId, input.boardId),
          ),
        );

      await ctx.db
        .update(suggestions)
        .set({ upVotes: newCount[0]?._count })
        .where(
          and(
            eq(suggestions.id, input.suggestionId),
            eq(suggestions.boardId, input.boardId),
          ),
        );

      return !isAlreadyUpVoted;
    }),
  getStats: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const uid = ctx.session.user.id;
      const board = await ctx.db.query.boards.findFirst({
        where(fields) {
          return eq(fields.slug, input.slug);
        },
      });
      const boardId = board?.id ?? -1;

      const [totalSuggestions, totalUpvotes] = await Promise.all([
        ctx.db
          .select({ _count: count(suggestions.id) })
          .from(suggestions)
          .where(eq(suggestions.boardId, boardId)),
        ctx.db
          .select({ _count: count(suggestionsUpVotes.id) })
          .from(suggestionsUpVotes)
          .where(eq(suggestionsUpVotes.boardId, boardId)),
      ]);

      if (!board || board.createdById !== uid) {
        return null;
      }

      return {
        totalSuggestions: totalSuggestions[0]?._count,
        totalUpvotes: totalUpvotes[0]?._count,
      };
    }),
});
