import { CreateBoardForm } from "../_components/create-board-form";
import { BoardCard } from "../_components/board-card";
import { MAX_NUMBER_OF_BOARDS } from "~/lib/constants";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerAuthSession();
  console.log(session);

  if (!session?.user) {
    redirect("/");
  }

  const userBoards = await api.boards.get.query();
  console.log(userBoards);

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      {userBoards.length > 0 ? (
        <div className="flex flex-col gap-4 sm:flex-row">
          {userBoards.map((board) => (
            <BoardCard
              key={board.id}
              href={`/dashboard/${board.id}`}
              {...board}
            />
          ))}
        </div>
      ) : (
        <>Nothing yet :/</>
      )}
      {userBoards.length >= MAX_NUMBER_OF_BOARDS ? (
        <>{`Uh oh! You've reached the maximum number of boards.`}</>
      ) : (
        <CreateBoardForm />
      )}
    </div>
  );
}
