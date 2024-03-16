"use client";

import { memo } from "react";
import { CreateSuggestionForm } from "~/app/_components/dashboard/create-suggestion-form";
import { type boards, type suggestions } from "~/server/db/schema";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { getRelativeTimeString } from "~/lib/utils";
import { SITE_URL } from "~/lib/constants";
import Link from "next/link";

interface PublicBoardProps {
  readonly board: typeof boards.$inferSelect;
  readonly suggestions: (typeof suggestions.$inferSelect)[];
  readonly isLoggedIn: boolean;
}

export const PublicBoard = memo(
  ({ board, suggestions, isLoggedIn }: PublicBoardProps) => {
    const signInRedirectSearchParams = new URLSearchParams({
      targetHostName: window.location.hostname,
    });

    return (
      <main className="mx-auto my-8 flex h-full max-w-[600px] flex-col items-center justify-center rounded-xl border border-transparent bg-white p-4 shadow-input dark:border-white/[0.2] dark:bg-black dark:shadow-none sm:my-16">
        <header className="flex w-full items-center justify-between p-4">
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <div className="flex space-x-4">
            {isLoggedIn ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"default"}>Create Suggestion</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <CreateSuggestionForm boardId={board.id} />
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                href={`${process.env.NODE_ENV === "production" ? SITE_URL : ""}/auth/signin?${signInRedirectSearchParams.toString()}`}
              >
                <Button variant={"default"}>Sign in</Button>
              </Link>
            )}
          </div>
        </header>

        <ul className="flex w-full flex-col">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} className="border-b p-4 last:border-b-0">
              <strong className="text-lg">{suggestion.title}</strong>
              <p>{suggestion.content}</p>
              <div className="flex items-center justify-between gap-2">
                <time className="block text-sm">
                  {getRelativeTimeString(suggestion.createdAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      </main>
    );
  },
);

PublicBoard.displayName = "PublicBoard";
