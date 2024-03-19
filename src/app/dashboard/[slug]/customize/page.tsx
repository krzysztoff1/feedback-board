import Link from "next/link";
import { redirect } from "next/navigation";
import { BoardCustomizer } from "~/components/dashboard/board-customizer";
import { Button } from "~/components/ui/button";
import { SITE_URL } from "~/lib/constants";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

interface CustomizeProps {
  readonly params: {
    readonly slug: string;
  };
}

export default async function Customize({ params }: CustomizeProps) {
  const [session, board] = await Promise.all([
    getServerAuthSession(),
    api.boards.get.query({ slug: String(params.slug) }),
  ]);

  if (!board || !session || board.createdById !== session?.user.id) {
    redirect("/dashboard");
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <h1 className="block text-2xl font-bold">Customize {board.name}</h1>

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

      <BoardCustomizer theme={board.theme} board={board} />
    </div>
  );
}
