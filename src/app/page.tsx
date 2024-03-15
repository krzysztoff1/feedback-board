import { unstable_noStore as noStore } from "next/cache";
import { getProviders } from "next-auth/react";
import { AuthForm } from "./_components/auth/auth-form";
import { headers } from "next/headers";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { PublicBoard } from "~/components/public-board/PublicBoard";
import { SITE_URL } from "~/lib/constants";

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
    const suggestions = await api.suggestions.get.query({
      boardId: board.id,
      offset: 0,
      page: 0,
    });

    return (
      <PublicBoard
        suggestions={suggestions}
        board={board}
        isLoggedIn={Boolean(session)}
      />
    );
  }

  if (isSubdomain) {
    redirect(SITE_URL);
  }

  const providers = await getProviders();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-content-center">
      <section className="mb-8">
        <h1 className="text-center text-3xl font-bold">Feedback Board</h1>
      </section>

      <AuthForm
        providers={providers}
        signInCallbackSearchParams={{
          isSubdomain: String(isSubdomain),
          callback: String(true),
          hostName,
        }}
      />
    </main>
  );
}
