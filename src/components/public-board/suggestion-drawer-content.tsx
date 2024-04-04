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
import { ChevronsUpDown } from "lucide-react";

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
