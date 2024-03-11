import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Boards } from "../_components/dashboard/boards";

export default async function Dashboard() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  const userBoards = await api.boards.getAll.query();

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <Boards userBoards={userBoards} />
    </div>
  );
}
