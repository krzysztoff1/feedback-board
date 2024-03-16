import { redirect } from "next/navigation";
import { PublicBoard } from "~/components/public-board/PublicBoard";
import { SITE_URL } from "~/lib/constants";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function View({ params }: { params: { slug: string } }) {
  const boardPromise = api.boards.getPublic.query({ slug: params.slug });
  const sessionPromise = getServerAuthSession();

  const [board, session] = await Promise.all([boardPromise, sessionPromise]);

  if (!board) {
    redirect(SITE_URL);
  }

  const suggestions = await api.suggestions.get.query({
    boardId: board?.id,
    offset: 0,
    page: 0,
  });

  return (
    <PublicBoard
      isLoggedIn={Boolean(session)}
      board={board}
      suggestions={suggestions}
    />
  );
}
