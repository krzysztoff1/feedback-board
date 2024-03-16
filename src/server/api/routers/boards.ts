import { and, eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { boards } from "~/server/db/schema";

export const boardsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
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
  getPublic: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.query.boards.findFirst({
        where(fields, operators) {
          return operators.eq(fields.slug, input.slug);
        },
      });
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

      await ctx.db.insert(boards).values({
        createdById: uid,
        ownerId: uid,
        name: input.name,
        slug: input.slug,
      });
    }),
  edit: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const promises = [];

      for (const [key, value] of Object.entries(input)) {
        if (value) {
          promises.push(
            ctx.db.update(boards).set({
              [key]: value,
            }),
          );
        }
      }

      await Promise.all(promises);
    }),
  validateBoardSlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const boardWithTheSameSlug = await ctx.db.query.boards.findFirst({
        where(fields, operators) {
          return operators.eq(fields.slug, input.slug);
        },
      });

      return !boardWithTheSameSlug;
    }),
});
