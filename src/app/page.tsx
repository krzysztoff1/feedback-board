import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { PublicBoard } from "~/components/public-board/public-board";
import { SITE_URL } from "~/lib/constants";
import { Hero } from "./landing/hero";
import { Features } from "./landing/bento";
import { Footer } from "./landing/footer";

export default async function Home() {
  noStore();

  const headersList = headers();
  const hostName = headersList.get("x-hostname") ?? "";
  const isSubdomain = hostName.split(".").length > 2;
  const firstPartOfHostName = hostName.split(".")[0];
  const session = await getServerAuthSession();
  const board =
    firstPartOfHostName && isSubdomain
      ? await api.boards.getPublic.query({ slug: firstPartOfHostName })
      : undefined;

  if (board) {
    const boardData = await api.boards.getPublicBoardData.query({
      boardId: board.id,
      page: 0,
    });

    return (
      <PublicBoard
        suggestions={boardData.suggestions}
        board={boardData.board}
        isLoggedIn={Boolean(session)}
        isPreview={false}
        themeCSS={board.themeCSS ?? ""}
      />
    );
  }

  if (isSubdomain && process.env.VERCEL_ENV === "production") {
    redirect(SITE_URL);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
