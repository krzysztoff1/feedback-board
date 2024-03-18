import { redirect } from "next/navigation";
import { BoardCustomizer } from "~/app/_components/dashboard/board-customizer";
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
      <span className="mb-8 flex items-center justify-between">
        <h1 className="block text-2xl font-bold">Customize {board.name}</h1>
      </span>

      <BoardCustomizer theme={board.theme} board={board} />
    </div>
  );
}
