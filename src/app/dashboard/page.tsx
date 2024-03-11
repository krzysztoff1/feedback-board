import { api } from "~/trpc/server";
import { CreateBoardForm } from "../_components/create-board-form";
import { BoardCard } from "../_components/board-card";
import { MAX_NUMBER_OF_BOARDS } from "~/lib/constants";

export default async function Home() {
  const userBoards = await api.board.get.query();

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
