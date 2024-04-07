import { eq, desc, asc, and } from "drizzle-orm";
import { z } from "zod";
import { PAGE_SIZE } from "~/lib/constants";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { comments, users } from "~/server/db/schema";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        boardId: z.number(),
        suggestionId: z.number(),
        content: z.string().min(1).max(5000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { boardId, suggestionId, content } = input;

      await ctx.db.insert(comments).values({
        createdBy: ctx.session.user.id,
        boardId,
        suggestionId,
        content,
      });
    }),
  infinite: publicProcedure
    .input(
      z.object({
        boardId: z.number(),
        suggestionId: z.number(),
        limit: z.number().min(1).max(100).optional().default(PAGE_SIZE),
        cursor: z.number().nullish(),
        sorting: z
          .object({ desc: z.boolean(), id: z.string() })
          .optional()
          .default({ desc: true, id: "createdAt" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const orderByColumn = comments.createdAt;
      const { cursor, limit } = input;
      const [nextComments] = await Promise.all([
        ctx.db
          .select()
          .from(comments)
          .leftJoin(users, eq(comments.createdBy, users.id))
          .orderBy(
            input.sorting.desc ? desc(orderByColumn) : asc(orderByColumn),
          )
          .where(
            and(
              eq(comments.boardId, input.boardId),
              eq(comments.suggestionId, input.suggestionId),
            ),
          )
          .limit(limit + 1)
          .offset(cursor ? cursor : 0),
        ctx.db
          .select({ _count: comments.id })
          .from(comments)
          .where(
            and(
              eq(comments.boardId, input.boardId),
              eq(comments.suggestionId, input.suggestionId),
            ),
          ),
      ]);

      let nextCursor: typeof cursor = null;

      if (nextComments.length > input.limit) {
        nextComments.pop();

        nextCursor = (cursor ?? 0) + input.limit;
      }

      return {
        items: nextComments.map(({ Comments, user }) => ({
          id: Comments.id,
          content: Comments.content,
          createdBy: user?.name,
          createdAt: Comments.createdAt,
          user: {
            id: user?.id,
            name: user?.name,
            image: user?.image,
          },
        })),
        nextCursor,
      };
    }),
  getCount: publicProcedure
    .input(
      z.object({
        boardId: z.number(),
        suggestionId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const query = await ctx.db
        .select({ _count: comments.id })
        .from(comments)
        .where(
          and(
            eq(comments.boardId, input.boardId),
            eq(comments.suggestionId, input.suggestionId),
          ),
        );

      return query?.[0]?._count ?? 0;
    }),
});
