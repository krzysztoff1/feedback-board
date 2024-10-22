import { memo } from "react";
import type { RouterOutput } from "~/server/api/root";
import { CreateCommmentForm } from "./create-comment-form";
import { api } from "~/trpc/react";
import { Comment } from "./comment";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronsUpDown, Loader } from "lucide-react";
import { cn } from "~/lib/utils";

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
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 0,
      },
    );

    const comments =
      commentsQuery.data?.pages.flatMap((page) => page.items) ?? [];

    const commentCount = api.comments.getCount.useQuery({
      boardId,
      suggestionId: suggestion.id,
    });

    return (
      <div className="p-4">
        <div className="flex flex-col space-y-4">
          <span className="text-sm text-foreground/50">Author</span>
          <span className="text-sm">{suggestion.user.name}</span>
          <span className="text-sm text-foreground/50">Content</span>
          <article className="prose prose-gray">{suggestion.content}</article>
        </div>

        <hr className="my-4" />

        <Collapsible>
          <div className="flex items-center justify-between space-x-4">
            <h4 className="text-sm font-semibold">
              Comment on this suggestion
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown size={16} className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="my-2 rounded-lg border p-4">
            <CreateCommmentForm
              suggestionId={suggestion.id}
              boardId={boardId}
              onSubmission={() => commentsQuery.refetch()}
            />
          </CollapsibleContent>
        </Collapsible>

        <hr className="my-4" />

        <ul className="mt-8 space-y-8">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </ul>

        {commentsQuery.isFetchingNextPage || commentsQuery.isFetching ? (
          <div className="mt-4 flex w-full items-center justify-center">
            <Loader className="mr-2 animate-spin" size={16} />
          </div>
        ) : null}

        {!commentsQuery.isFetchingNextPage &&
          !commentsQuery.isFetching &&
          !commentsQuery.data?.pages.flatMap((page) => page).length && (
            <div className="mt-4 flex w-full items-center justify-center">
              <span className="text-foreground/50">No comments found</span>
            </div>
          )}

        <div className="mt-4 flex w-full items-center justify-center">
          <Button
            onClick={async () => {
              await commentsQuery.fetchNextPage();
            }}
            disabled={!commentsQuery.hasNextPage}
            className="mt-4"
            variant={"outline"}
          >
            Load more
          </Button>
        </div>

        <p
          className={cn("text-sm text-foreground/50", {
            "opacity-0": commentCount.status === "loading",
          })}
        >
          {commentCount.data} comments
        </p>
      </div>
    );
  },
);

SuggestionDrawerContent.displayName = "SuggestionDraweContent";
