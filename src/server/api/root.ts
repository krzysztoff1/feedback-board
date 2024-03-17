import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "~/server/api/trpc";
import { boardsRouter } from "./routers/boards";
import { suggestionsRouter } from "./routers/suggestions";
import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  boards: boardsRouter,
  suggestions: suggestionsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
