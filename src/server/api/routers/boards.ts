import { and, count, eq } from "drizzle-orm";
import { z } from "zod";
import { boardThemeSchema } from "~/lib/board-theme.schema";
import { DISSALLOWED_BOARD_SLUGS } from "~/lib/constants";
import { convertToSlug } from "~/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { boards, suggestions } from "~/server/db/schema";

export const boardsRouter = createTRPCRouter({
  getUserBoards: protectedProcedure.query(async ({ ctx }) => {
    const uid = ctx.session.user.id;
    return ctx.db.select().from(boards).where(eq(boards.ownerId, uid));
  }),
  get: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const uid = ctx.session.user.id;

      return ctx.db.query.boards.findFirst({
        where(fields, operators) {
          return and(
            operators.eq(fields.slug, input.slug),
            operators.eq(fields.ownerId, uid),
          );
        },
      });
    }),
  getBoardData: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const targetBoard = await ctx.db.query.boards.findFirst({
        where(fields, operators) {
          return operators.eq(fields.slug, input.slug);
        },
      });

      if (!targetBoard) {
        return { board: null };
      }

      const suggestionsCountResult = await ctx.db
        .select({ count: count(suggestions.id) })
        .from(suggestions)
        .where(eq(suggestions.boardId, targetBoard.id));
      const suggestionsCount = suggestionsCountResult?.[0]?.count ?? 0;

      return { board: { ...targetBoard, suggestionsCount } };
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        slug: z.string().min(3).max(60),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const uid = ctx.session.user.id;

      if (DISSALLOWED_BOARD_SLUGS.includes(convertToSlug(input.slug))) {
        throw new Error("Invalid slug");
      }

      await ctx.db.insert(boards).values({
        createdById: uid,
        ownerId: uid,
        name: input.name,
        slug: convertToSlug(input.slug),
      });
    }),
  edit: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256).optional(),
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const uid = ctx.session.user.id;
      const promises = [];

      for (const [key, value] of Object.entries(input)) {
        if (value) {
          promises.push(
            ctx.db
              .update(boards)
              .set({
                [key]: value,
              })
              .where(and(eq(boards.ownerId, uid), eq(boards.id, input.id))),
          );
        }
      }

      await Promise.all(promises);
    }),
  setTheme: protectedProcedure
    .input(
      z.object({
        theme: boardThemeSchema,
        themeCSS: z.string(),
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const uid = ctx.session.user.id;

      await ctx.db
        .update(boards)
        .set({
          theme: input.theme,
          themeCSS: input.themeCSS,
        })
        .where(and(eq(boards.ownerId, uid), eq(boards.id, input.id)));
    }),
  validateBoardSlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.slug.length < 3) {
        return false;
      }

      if (DISSALLOWED_BOARD_SLUGS.includes(input.slug)) {
        return false;
      }

      const boardWithTheSameSlug = await ctx.db.query.boards.findFirst({
        where(fields, operators) {
          return operators.eq(fields.slug, input.slug);
        },
      });

      return !boardWithTheSameSlug;
    }),
});
