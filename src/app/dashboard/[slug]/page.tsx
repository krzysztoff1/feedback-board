import Link from "next/link";
import { redirect } from "next/navigation";
import { SuggestionTable } from "~/components/dashboard/suggestions-table";
import { Button } from "~/components/ui/button";
import { SITE_URL } from "~/lib/constants";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

interface BoardPageProps {
  readonly params: {
    readonly slug: string;
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [board, totalSuggestionsCount] = await Promise.all([
    api.boards.get.query({ slug: params.slug }),
    api.suggestions.getTotalSuggestionsCount.query({ slug: params.slug }),
  ]);

  if (!board || !session || board.createdById !== session?.user.id) {
    redirect("/dashboard");
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <h1 className="block text-2xl font-bold">{board.name}</h1>

        <Link
          href={
            process.env.VERCEL_ENV === "production"
              ? `https://${board.slug}.${SITE_URL.replace("https://", "")}`
              : `/dashboard/${board.slug}/view`
          }
          className="block"
        >
          <Button variant={"outline"}>View live</Button>
        </Link>
      </header>

      <SuggestionTable totalSuggestionsCount={totalSuggestionsCount} />
    </div>
  );
}
