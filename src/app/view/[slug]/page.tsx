import { redirect } from "next/navigation";
import { PublicBoard } from "~/components/public-board/PublicBoard";
import { SITE_URL } from "~/lib/constants";
import { api } from "~/trpc/server";

export default async function View({ params }: { params: { slug: string } }) {
  const board = await api.boards.get.query({ slug: params.slug });

  if (!board) {
    redirect(SITE_URL);
  }

  return <PublicBoard board={board} />;
}
