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
  const boardData = await api.boards.getPublicBoardData.query({
    slug: params.slug,
    page: 0,
  });

  if (!boardData.board) {
    redirect(SITE_URL);
  }

  return (
    <PublicBoard
      board={boardData.board}
      suggestions={boardData.suggestions}
      themeCSS={boardData.board?.themeCSS ?? ""}
      isPreview={false}
    />
  );
}
