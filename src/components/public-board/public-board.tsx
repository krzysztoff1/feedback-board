"use client";

import { type RouterOutput } from "~/server/api/root";
import { type boards } from "~/server/db/schema";
import { memo } from "react";
import { CreateSuggestionForm } from "~/app/_components/dashboard/create-suggestion-form";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, getRelativeTimeString } from "~/lib/utils";
import { SITE_URL } from "~/lib/constants";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface PublicBoardProps {
  readonly board: typeof boards.$inferSelect;
  readonly suggestions: RouterOutput["suggestions"]["get"];
  readonly isLoggedIn: boolean;
  readonly isPreview: boolean;
  readonly themeCSS?: string;
}

export const PublicBoard = memo(
  ({
    board,
    suggestions,
    isLoggedIn,
    isPreview,
    themeCSS = "",
  }: PublicBoardProps) => {
    const session = useSession();
    const signInRedirectSearchParams = new URLSearchParams({
      targetHostName:
        typeof window === "undefined" ? "" : window.location.hostname,
    });

    return (
      <>
        {themeCSS ? (
          <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
        ) : null}

        <main
          className={cn(
            "board-main mx-auto flex h-full max-w-[600px] flex-col items-center justify-center border border-transparent bg-card p-4 text-card-foreground shadow-input dark:border-border dark:bg-card dark:shadow-none sm:rounded-lg",
            { "sm:my-8 md:my-16": !isPreview },
          )}
        >
          <header className="flex w-full flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold">{board.name}</h1>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Popover>
                  <PopoverTrigger
                    style={isPreview ? { pointerEvents: "none" } : {}}
                    asChild
                  >
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

              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.data?.user?.image ?? ""}
                  alt="Profile picture"
                />
                <AvatarFallback>
                  {session.data?.user?.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
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
