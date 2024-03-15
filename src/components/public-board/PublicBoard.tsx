"use client";

import Link from "next/link";
import { memo } from "react";
import { CreateSuggestionForm } from "~/app/_components/dashboard/create-suggestion-form";
import { type boards, type suggestions } from "~/server/db/schema";
import { Button } from "../ui/button";

interface PublicBoardProps {
  readonly board: typeof boards.$inferSelect;
  readonly suggestions: (typeof suggestions.$inferSelect)[];
  readonly isLoggedIn: boolean;
}

export const PublicBoard = memo(
  ({ board, suggestions, isLoggedIn }: PublicBoardProps) => {
    return (
      <main className="flex h-full flex-col items-center justify-center">
        <h1>{board.name}</h1>

        <p>This is a public board. You can share this link with anyone:</p>

        <ul className="flex space-x-4">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <strong className="text-lg">{suggestion.title}</strong>
              <p>{suggestion.content}</p>
            </li>
          ))}
        </ul>

        {isLoggedIn ? (
          <CreateSuggestionForm boardId={board.id} />
        ) : (
          <>
            <p>Log in to create a suggestion</p>
            <Link href={`/auth/signin?returnToBoard=${board.slug}`}>
              <Button variant={"secondary"}>Sign in</Button>
            </Link>
          </>
        )}
      </main>
    );
  },
);

PublicBoard.displayName = "PublicBoard";
