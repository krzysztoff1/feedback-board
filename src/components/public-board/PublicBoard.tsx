import { memo } from "react";
import { type boards } from "~/server/db/schema";

interface PublicBoardProps {
  readonly board: typeof boards.$inferSelect;
}

export const PublicBoard = memo(({ board }: PublicBoardProps) => {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1>{board.name}</h1>

      <p>This is a public board. You can share this link with anyone:</p>
    </main>
  );
});

PublicBoard.displayName = "PublicBoard";
