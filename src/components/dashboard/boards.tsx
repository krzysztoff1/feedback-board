"use client";

import { memo } from "react";
import { CreateBoardForm } from "./create-board-form";
import { type boards } from "~/server/db/schema";
import { BoardCard } from "./board-card";
import { useState } from "react";
import { MAX_NUMBER_OF_BOARDS } from "~/lib/constants";

interface BoardCardProps {
  readonly userBoards: (typeof boards.$inferSelect)[];
}

export const Boards = memo(({ userBoards: _userBoards }: BoardCardProps) => {
  const [userBoards, setUserBoards] = useState(_userBoards);

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      {userBoards.length > 0 ? (
        <div className="flex flex-col gap-4">
          {userBoards.map((board) => (
            <BoardCard
              key={board.id}
              href={`/dashboard/${board.slug}`}
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
        <div className="max-w-xl rounded-lg border p-4">
          <CreateBoardForm setUserBoards={setUserBoards} />
        </div>
      )}
    </div>
  );
});

Boards.displayName = "Boards";
