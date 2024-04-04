import { memo } from "react";
import type { RouterOutput } from "~/server/api/root";
import { CreateCommmentForm } from "./create-comment-form";
import { api } from "~/trpc/react";
import { Comment } from "./comment";

interface SuggestionDrawerContentProps {
  readonly boardId: number;
  readonly suggestion: RouterOutput["suggestions"]["get"][number];
}

export const SuggestionDrawerContent = memo(
  ({ boardId, suggestion }: SuggestionDrawerContentProps) => {
    const comments = api.comments.get.useQuery({
      boardId,
      page: 0,
    });

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
          onSubmission={() => comments.refetch()}
        />
        <ul className="mt-4 space-y-8">
          {comments.data?.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </ul>
      </div>
    );
  },
);

SuggestionDrawerContent.displayName = "SuggestionDraweContent";
