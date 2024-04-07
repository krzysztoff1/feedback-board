import type { SuggestionsStatus } from "~/server/db/schema";

export const statusLabels: Record<SuggestionsStatus, string> = {
  backlog: "Backlog",
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
};
