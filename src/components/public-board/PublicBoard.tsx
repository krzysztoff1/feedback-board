"use client";

import { memo } from "react";
import { CreateSuggestionForm } from "~/app/_components/dashboard/create-suggestion-form";
import { type boards } from "~/server/db/schema";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { getRelativeTimeString } from "~/lib/utils";
import { SITE_URL } from "~/lib/constants";
import Link from "next/link";
import { type RouterOutput } from "~/server/api/root";

interface PublicBoardProps {
  readonly board: typeof boards.$inferSelect;
  readonly suggestions: RouterOutput["suggestions"]["get"];
  readonly isLoggedIn: boolean;
}

export const PublicBoard = memo(
  ({ board, suggestions, isLoggedIn }: PublicBoardProps) => {
    const signInRedirectSearchParams = new URLSearchParams({
      targetHostName: window.location.hostname,
    });

    return (
      <>
        <style>
          {`
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 142.1 76.2% 36.3%;
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 142.1 76.2% 36.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 20 14.3% 4.1%;
    --foreground: 0 0% 95%;
    --card: 24 9.8% 10%;
    --card-foreground: 0 0% 95%;
    --popover: 0 0% 9%;
    --popover-foreground: 0 0% 95%;
    --primary: 142.1 70.6% 45.3%;
    --primary-foreground: 144.9 80.4% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 15%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 12 6.5% 15.1%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 85.7% 97.3%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 142.4 71.8% 29.2%;
  }
`}
        </style>
        <main className="rounded-radius mx-auto my-8 flex h-full max-w-[600px] flex-col items-center justify-center border border-transparent bg-card p-4 text-card-foreground shadow-input dark:border-border dark:bg-card dark:shadow-none sm:my-16">
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

          {suggestions.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <strong className="text-xl font-bold">No suggestions yet</strong>
              <p className="text-center text-sm">
                Be the first to suggest something
              </p>
            </div>
          ) : (
            <ul className="flex w-full flex-col">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.suggestions.id}
                  className="border-b p-4 last:border-b-0"
                >
                  <strong className="text-lg text-primary">
                    {suggestion.suggestions.title}
                  </strong>
                  <p>
                    {suggestion.suggestions.content.length > 100
                      ? `${suggestion.suggestions.content.slice(0, 100)}...`
                      : suggestion.suggestions.content}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <time className="block text-sm">
                      {getRelativeTimeString(suggestion.suggestions.createdAt)}
                    </time>
                    <span className="text-sm">
                      {suggestion.user?.name ?? "Anonymous"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </>
    );
  },
);

PublicBoard.displayName = "PublicBoard";
