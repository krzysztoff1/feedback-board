import { memo } from "react";
import type { RouterOutput } from "~/server/api/root";
import { CreateCommmentForm } from "./create-comment-form";
import { api } from "~/trpc/react";
import { Comment } from "./comment";
import { Button } from "../ui/button";

interface SuggestionDrawerContentProps {
  readonly boardId: number;
  readonly suggestion: RouterOutput["suggestions"]["get"][number];
}

export const SuggestionDrawerContent = memo(
  ({ boardId, suggestion }: SuggestionDrawerContentProps) => {
    const commentsQuery = api.comments.infinite.useInfiniteQuery(
      {
        boardId,
        limit: 3,
        suggestionId: suggestion.id,
        sorting: { desc: true, id: "createdAt" },
      },
      {
        getNextPageParam: (lastPage) =>
          lastPage?.[lastPage.length - 1]?.nextCursor,
        initialCursor: 0,
      },
    );

    return (
      <div className="p-4">
        <div className="flex flex-col space-y-4">
          <span className="text-sm text-foreground/50">Author</span>
          <span className="text-sm">{suggestion.user.name}</span>
          <span className="text-sm text-foreground/50">Content</span>
          <article className="prose prose-gray">{suggestion.content}</article>
        </div>

        <CreateCommmentForm
          suggestionId={suggestion.id}
          boardId={boardId}
          onSubmission={() => commentsQuery.refetch()}
        />

        <ul className="mt-8 space-y-8">
          {commentsQuery.data?.pages
            .flatMap((page) => page)
            .map((comment) => <Comment key={comment.id} comment={comment} />)}
        </ul>

        <div className="mt-4 flex w-full items-center justify-center">
          <Button
            onClick={async () => {
              await commentsQuery.fetchNextPage();
            }}
            disabled={
              commentsQuery.isFetchingNextPage || !commentsQuery.hasNextPage
            }
            className="mt-4"
            variant={"outline"}
          >
            Load more
          </Button>
        </div>
      </div>
    );
  },
);

SuggestionDrawerContent.displayName = "SuggestionDraweContent";
