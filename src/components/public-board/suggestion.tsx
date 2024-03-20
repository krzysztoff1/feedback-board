import type { RouterOutput } from "~/server/api/root";
import { ArrowBigUp, Dot } from "lucide-react";
import { useSession } from "next-auth/react";
import { memo } from "react";
import { cn, getRelativeTimeString, throttle, truncate } from "~/lib/utils";
import { api } from "~/trpc/react";
import { motion } from "framer-motion";

interface SuggestionProps {
  readonly suggestion: RouterOutput["boards"]["getPublicBoardData"]["suggestions"][number];
  readonly boardId: number;
  readonly isPreview: boolean;
}

export const Suggestion = memo(
  ({ suggestion, boardId, isPreview }: SuggestionProps) => {
    const session = useSession();
    const upVoteHandler = api.suggestions.toggleUpVote.useMutation();

    const handleUpVote = throttle(async () => {
      if (session.status !== "authenticated" || isPreview) {
        return;
      }

      const wrapperSelector = `#suggestion-${suggestion.id}`;
      const icon = document.querySelector(`${wrapperSelector} .upvote-icon`);
      const counter = document.querySelector(
        `${wrapperSelector} .upvote-counter`,
      );

      if (icon && counter) {
        if (suggestion.isUpVoted) {
          icon.classList.remove("text-primary");
          counter.textContent = `${(Number(counter.textContent) ?? 0) - 1}`;
        } else {
          icon.classList.add("text-primary");
          counter.textContent = `${(Number(counter.textContent) ?? 0) + 1}`;
        }
      }

      suggestion.isUpVoted = !suggestion.isUpVoted;

      await upVoteHandler.mutateAsync({
        suggestionId: suggestion.id,
        boardId,
      });
    }, 250);

    return (
      <motion.li
        id={`suggestion-${suggestion.id}`}
        className={cn(
          "flex border-x border-t border-border bg-card",
          "first:rounded-t-lg",
          "last:rounded-b-lg last:border-b",
        )}
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
      >
        <div className="p-2">
          <button
            onClick={handleUpVote}
            className="flex flex-col items-center justify-center gap-1 rounded-lg p-2 hover:bg-secondary"
          >
            <ArrowBigUp
              size={18}
              className={cn(
                "upvote-icon transition-transform hover:scale-105",
                { "text-primary": suggestion.isUpVoted },
              )}
              fill={suggestion.isUpVoted ? "currentColor" : undefined}
            />
            <span className="upvote-counter block text-sm">
              {suggestion.upVotes}
            </span>
          </button>
        </div>
        <div className="flex w-full flex-col pb-4 pr-4 pt-4">
          <strong className="block text-lg text-primary">
            {suggestion.title}
          </strong>
          <p className="block text-base">{truncate(suggestion.content)}</p>
          <div className="mt-2 flex items-center justify-start">
            <span className="block text-sm text-foreground/70">
              {suggestion.user?.name ?? "Anonymous"}
            </span>
            <Dot size={18} className="text-foreground/70" />
            <time className="block text-sm text-foreground/70">
              {getRelativeTimeString(suggestion.createdAt, "en-US")}
            </time>
          </div>
        </div>
      </motion.li>
    );
  },
);

Suggestion.displayName = "Suggestion";
