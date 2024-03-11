import { CreateBoardForm } from "../_components/create-board-form";
import { BoardCard } from "../_components/board-card";
import { MAX_NUMBER_OF_BOARDS } from "~/lib/constants";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return null;
  }

  const userBoards = await api.boards.get.query();

  return (
    <>
      {userBoards.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {userBoards.map((board) => (
            <BoardCard
              key={board.id}
              href={`/dashboard/board/${board.id}`}
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
    </>
  );
}
