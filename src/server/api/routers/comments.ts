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
  get: publicProcedure
    .input(
      z.object({
        boardId: z.number(),
        page: z.number(),
        pageSize: z.number().min(1).max(100).optional().default(PAGE_SIZE),
        sorting: z
          .object({ desc: z.boolean(), id: z.string() })
          .optional()
          .default({ desc: true, id: "createdAt" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const orderByColumn = comments.createdAt;
      const queryResult = await ctx.db
        .select()
        .from(comments)
        .leftJoin(users, eq(comments.createdBy, users.id))
        .orderBy(input.sorting.desc ? desc(orderByColumn) : asc(orderByColumn))
        .where(eq(comments.boardId, input.boardId))
        .limit(input.pageSize)
        .offset(input.page * input.pageSize);

      return queryResult.map(({ Comments, user }) => ({
        id: Comments.id,
        content: Comments.content,
        createdBy: user?.name,
        createdAt: Comments.createdAt,
        user: {
          id: user?.id,
          name: user?.name,
          image: user?.image,
        },
      }));
    }),

  infinite: publicProcedure
    .input(
      z.object({
        boardId: z.number(),
        suggestionId: z.number(),
        limit: z.number().min(1).max(100).optional().default(PAGE_SIZE),
        cursor: z.number(),
        sorting: z
          .object({ desc: z.boolean(), id: z.string() })
          .optional()
          .default({ desc: true, id: "createdAt" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const orderByColumn = comments.createdAt;
      const queryResult = await ctx.db
        .select()
        .from(comments)
        .leftJoin(users, eq(comments.createdBy, users.id))
        .orderBy(input.sorting.desc ? desc(orderByColumn) : asc(orderByColumn))
        .where(
          and(
            eq(comments.boardId, input.boardId),
            eq(comments.suggestionId, input.suggestionId),
          ),
        )
        .limit(input.limit)
        .offset(input.cursor);

      return queryResult.map(({ Comments, user }) => ({
        id: Comments.id,
        content: Comments.content,
        createdBy: user?.name,
        createdAt: Comments.createdAt,
        user: {
          id: user?.id,
          name: user?.name,
          image: user?.image,
        },
        nextCursor: input.cursor + input.limit,
      }));
    }),
});
