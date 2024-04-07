import { memo } from "react";
import { type suggestions } from "~/server/db/schema";

interface StatusBadgeProps {
  readonly status: typeof suggestions.$inferSelect.status;
}

export const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  switch (status) {
    case "backlog":
      return <span className="">Backlog</span>;
    case "todo":
      return <span className="">To do</span>;
    case "inProgress":
      return <span className="">In progress</span>;
    case "done":
      return <span className="">Done</span>;
    case "cancelled":
      return <span className="">Cancelled</span>;
    default:
      return <span className="">Unknown</span>;
  }
});

StatusBadge.displayName = "StatusBadge";
