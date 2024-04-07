import { memo } from "react";
import type { RouterOutput } from "~/server/api/root";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dot } from "lucide-react";

const NEW_BADGE_DAY_THRESHOLD = 2;

export const Comment = memo(
  ({
    comment,
  }: {
    readonly comment: RouterOutput["comments"]["infinite"]["items"][number];
  }) => {
    const { user } = comment;

    return (
      <li>
        <div className="mb-4 flex items-center space-x-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image ?? undefined} alt="Profile picture" />
            <AvatarFallback>{user.name?.[0] ?? "A"}</AvatarFallback>
          </Avatar>
          <span className="block text-sm text-foreground">{user.name}</span>
          {new Date(comment.createdAt) >
            new Date(
              Date.now() - NEW_BADGE_DAY_THRESHOLD * 24 * 60 * 60 * 1000,
            ) && (
            <span className="rounded-full bg-emerald-700/50 px-2 text-sm text-emerald-300">
              New
            </span>
          )}
        </div>
        <p className="radius-l mb-4 block rounded-md border p-4 shadow-md">
          {comment.content}
        </p>
        <div className="flex items-center justify-start">
          <span className="block text-xs text-foreground/70">
            {new Date(comment.createdAt).toLocaleDateString([], {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <Dot size={18} className="text-foreground/70" />
          <span className="block text-xs text-foreground/70">
            {new Date(comment.createdAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </div>
      </li>
    );
  },
);

Comment.displayName = "Comment";
