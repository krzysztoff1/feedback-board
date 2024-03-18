import Link from "next/link";
import { redirect } from "next/navigation";
import { SuggestionCard } from "~/components/dashboard/suggestion-card";
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

  const [board, stats, suggestions] = await Promise.all([
    api.boards.get.query({ slug: params.slug }),
    api.suggestions.getStats.query({ slug: params.slug }),
    api.suggestions.getAll.query({ slug: params.slug, page: 0 }),
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

      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          <li className="align-center flex">
            <span>Your board URL: </span>
            <Link
              href={`https://${board.slug}.${SITE_URL.replace("https://", "")}`}
            >
              <strong className="ml-2">
                {`${board.slug}.${SITE_URL.replace("https://", "")}`}
              </strong>
            </Link>
          </li>

          <li className="align-center flex">
            <span>Total suggestions: </span>
            <strong className="ml-2">{stats?.totalSuggestions}</strong>
          </li>
          <li className="align-center flex">
            <span>Total upvotes: </span>
            <strong className="ml-2">{stats?.totalUpvotes}</strong>
          </li>
        </ul>
      </div>

      <ul className="mt-4 flex flex-col gap-4">
        {suggestions.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        ))}
      </ul>
    </div>
  );
}
