"use client";

import { type RouterOutput } from "~/server/api/root";
import { memo } from "react";
import { CreateSuggestionForm } from "~/components/dashboard/create-suggestion-form";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, getRelativeTimeString, throttle } from "~/lib/utils";
import { SITE_URL } from "~/lib/constants";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowBigUp } from "lucide-react";
import { api } from "~/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import { CreateSuggestionModal } from "./create-suggestion-modal";

interface PublicBoardProps {
  readonly board: RouterOutput["boards"]["getPublicBoardData"]["board"];
  readonly suggestions: RouterOutput["boards"]["getPublicBoardData"]["suggestions"];
  readonly isPreview: boolean;
  readonly themeCSS?: string;
}

export const PublicBoard = memo(
  ({ board, suggestions, isPreview, themeCSS = "" }: PublicBoardProps) => {
    const session = useSession();
    const signInRedirectSearchParams = new URLSearchParams({
      targetHostName:
        typeof window === "undefined" ? "" : window.location.hostname,
    });

    const upVoteHandler = api.suggestions.toggleUpVote.useMutation();

    if (!board) {
      return null;
    }

    return (
      <>
        {themeCSS ? (
          <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
        ) : null}

        <main
          className={cn(
            "board-main mx-auto flex h-full max-w-[600px] flex-col items-center justify-center gap-4 text-card-foreground shadow-input dark:shadow-none sm:rounded-lg",
            { "sm:my-8 md:my-16": !isPreview },
          )}
        >
          <header className="flex w-full flex-row items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
            <h1 className="text-2xl font-bold">{board.name}</h1>
            <div className="flex items-center gap-4">
              <CreateSuggestionModal boardId={board.id} />
              <AnimatePresence>
                {session.status === "authenticated" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    key={session.data?.user?.id}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.data?.user?.image ?? ""}
                        alt="Profile picture"
                      />
                      <AvatarFallback>
                        {session.data?.user?.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {session.status === "unauthenticated" ? (
                <Link
                  href={`${process.env.NODE_ENV === "production" ? SITE_URL : ""}/auth/signin?${signInRedirectSearchParams.toString()}`}
                >
                  <Button variant={"default"}>Sign in</Button>
                </Link>
              ) : null}
            </div>
          </header>

          <div className="w-full rounded-lg border border-border bg-card">
            {suggestions.length === 0 ? (
              <div className="mt-8 flex min-h-72 flex-col items-center justify-start gap-4">
                <strong className="text-xl font-bold">
                  No suggestions yet
                </strong>
                <p className="text-balance text-center text-sm">
                  Let your voice be heard! Create the first suggestion.
                </p>
                <AnimatePresence>
                  {session.status === "authenticated" ? (
                    <Popover>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.16 }}
                      >
                        <PopoverTrigger
                          style={isPreview ? { pointerEvents: "none" } : {}}
                          asChild
                        >
                          <Button variant={"default"}>Create Suggestion</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <CreateSuggestionForm boardId={board.id} />
                        </PopoverContent>
                      </motion.div>
                    </Popover>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {session.status === "unauthenticated" ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.16 }}
                    >
                      <Link
                        href={`${process.env.NODE_ENV === "production" ? SITE_URL : ""}/auth/signin?${signInRedirectSearchParams.toString()}`}
                      >
                        <Button variant={"default"}>Sign in</Button>
                      </Link>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <ul className="flex w-full flex-col">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    id={`suggestion-${suggestion.id}`}
                    className="flex border-b last:border-b-0"
                  >
                    <button
                      onClick={throttle(async () => {
                        if (session.status !== "authenticated" || isPreview) {
                          return;
                        }

                        const wrapperSelector = `#suggestion-${suggestion.id}`;
                        const icon = document.querySelector(
                          `${wrapperSelector} .upvote-icon`,
                        );
                        const counter = document.querySelector(
                          `${wrapperSelector} .upvote-counter`,
                        );

                        if (icon && counter) {
                          if (suggestion.isUpVoted) {
                            icon.classList.remove("text-primary");
                            counter.textContent = `${(Number(counter.textContent) ?? 0) - 1}`;
                          } else {
                            icon.classList.add("text-primary");
                            counter.textContent = `${(Number(counter.textContent) ?? 0) + 1}`;
                          }
                        }

                        suggestion.isUpVoted = !suggestion.isUpVoted;

                        await upVoteHandler.mutateAsync({
                          boardId: board.id,
                          suggestionId: suggestion.id,
                        });
                      }, 250)}
                      className="flex flex-col items-center justify-center gap-1 p-4"
                    >
                      <ArrowBigUp
                        size={24}
                        className={cn(
                          "upvote-icon transition-transform hover:scale-105",
                          { "text-primary": suggestion.isUpVoted },
                        )}
                        fill={suggestion.isUpVoted ? "currentColor" : undefined}
                      />
                      <span className="upvote-counter block">
                        {suggestion.upVotes}
                      </span>
                    </button>
                    <div className="flex w-full flex-col pb-4 pr-4 pt-4">
                      <strong className="text-lg text-primary">
                        {suggestion.title}
                      </strong>
                      <p>
                        {suggestion.content.length > 100
                          ? `${suggestion.content.slice(0, 100)}...`
                          : suggestion.content}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <time className="block text-sm">
                          {getRelativeTimeString(suggestion.createdAt, "en-US")}
                        </time>
                        <span className="text-sm">
                          {suggestion.user?.name ?? "Anonymous"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href={SITE_URL} passHref target="_blank" className="self-end">
            <Button variant={"ghost"} size={"sm"} className="opacity-70">
              Powered by
              <strong className="ml-1">Suggestli</strong>
            </Button>
          </Link>
        </main>
      </>
    );
  },
);

PublicBoard.displayName = "PublicBoard";
