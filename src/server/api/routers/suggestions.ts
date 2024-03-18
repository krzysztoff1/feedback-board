import { type AnyColumn, and, desc, eq, sql, count } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { suggestions, suggestionsUpVotes, users } from "~/server/db/schema";

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};

export const suggestionsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ boardId: z.number(), page: z.number() }))
    .query(async ({ input, ctx }) => {
      const PAGE_SIZE = 10;
      const uid = ctx?.session?.user.id;

      const [board, boardSuggestions, upVotedSuggestions] = await Promise.all([
        ctx.db.query.boards.findFirst({
          where(fields, operators) {
            return operators.eq(fields.id, input.boardId);
          },
        }),
        ctx.db
          .select()
          .from(suggestions)
          .leftJoin(users, eq(suggestions.createdBy, users.id))
          .orderBy(desc(suggestions.createdAt))
          .where(eq(suggestions.boardId, input.boardId))
          .limit(PAGE_SIZE)
          .offset(input.page * PAGE_SIZE),
        uid
          ? ctx.db.query.suggestionsUpVotes.findMany({
              where(fields) {
                return and(
                  eq(fields.boardId, input.boardId),
                  eq(fields.userId, uid),
                );
              },
            })
          : [],
      ]);
      return {
        board,
        suggestions: boardSuggestions.map((suggestion) => {
          return {
            ...suggestion.suggestions,
            user: suggestion.user,
            isUpVoted: upVotedSuggestions.some(
              (upVotedSuggestion) =>
                upVotedSuggestion.suggestionId === suggestion.suggestions.id &&
                upVotedSuggestion.boardId === suggestion.suggestions.boardId,
            ),
          };
        }),
      };
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
});
