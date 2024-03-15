import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function BoardPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  const board = await api.boards.get.query({
    id: parseInt(params.id),
  });

  if (!board) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>{board.name}</h1>
    </div>
  );
}
