import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "~/server/api/trpc";
import { boardsRouter } from "./routers/boards";
import { suggestionsRouter } from "./routers/suggestions";
import { usersRouter } from "./routers/users";
import { commentsRouter } from "./routers/comments";

export const appRouter = createTRPCRouter({
  boards: boardsRouter,
  suggestions: suggestionsRouter,
  users: usersRouter,
  comments: commentsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
