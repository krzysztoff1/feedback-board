import Link from "next/link";
import { redirect } from "next/navigation";
import { BoardCustomizer } from "~/app/_components/dashboard/board-customizer";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

interface BoardPageProps {
  readonly params: {
    readonly slug: string;
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const [session, board] = await Promise.all([
    getServerAuthSession(),
    api.boards.get.query({ slug: params.slug }),
  ]);

  if (!board || !session || board.createdById !== session?.user.id) {
    redirect("/dashboard");
  }

  return (
    <div>
      <span className="mb-8 flex items-center justify-between">
        <h1 className="block text-2xl font-bold">{board.name}</h1>

        <Link
          href={
            process.env.NODE_ENV === "production"
              ? `https://${board.slug}.goog.info`
              : `/view/${board.slug}`
          }
          className="block"
        >
          <Button variant={"outline"}>View live</Button>
        </Link>
      </span>

      <BoardCustomizer theme={board.theme} board={board} />

      {/* <ul className="mt-4 flex flex-col gap-4">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.suggestions.id}
            suggestion={suggestion}
          />
        ))}
      </ul> */}
    </div>
  );
}
