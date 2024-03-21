import { redirect } from "next/navigation";
import { PublicBoard } from "~/components/public-board/public-board";
import { SITE_URL } from "~/lib/constants";
import { api } from "~/trpc/server";

interface ViewProps {
  readonly params: {
    readonly slug: string;
  };
}

export default async function View({ params }: ViewProps) {
  const [boardData, initialSuggestions] = await Promise.all([
    api.boards.getBoardData.query({
      slug: params.slug,
    }),
    api.suggestions.get.query({
      slug: params.slug,
      page: 0,
    }),
  ]);

  if (!boardData.board) {
    redirect(SITE_URL);
  }

  return (
    <PublicBoard
      board={boardData.board}
      initialSuggestions={initialSuggestions}
      themeCSS={boardData.board?.themeCSS ?? ""}
      isPreview={false}
    />
  );
}
