"use client";

import { type RouterOutput } from "~/server/api/root";
import { memo } from "react";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { SITE_URL } from "~/lib/constants";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { CreateSuggestionModal } from "./create-suggestion-modal";
import { Suggestion } from "./suggestion";

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
              {suggestions.length > 0 ? (
                <CreateSuggestionModal
                  isPreview={isPreview}
                  boardId={board.id}
                />
              ) : null}

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

          <div className="w-full">
            {suggestions.length === 0 ? (
              <div className="mt-8 flex min-h-72 flex-col items-center justify-start gap-4">
                <strong className="text-xl font-bold">
                  No suggestions yet
                </strong>
                <p className="text-balance text-center text-sm">
                  Let your voice be heard! Create the first suggestion.
                </p>

                <CreateSuggestionModal
                  isPreview={isPreview}
                  isCta={true}
                  boardId={board.id}
                />

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
              <motion.ul
                className="flex w-full flex-col"
                variants={{
                  hidden: {
                    x: "-100vw",
                  },
                  visible: {
                    x: 0,
                    transition: {
                      when: "beforeChildren",
                      staggerChildren: 0.2,
                    },
                  },
                }}
                animate="visible"
                initial="hidden"
              >
                {suggestions.map((suggestion) => (
                  <Suggestion
                    key={suggestion.id}
                    suggestion={suggestion}
                    isPreview={isPreview}
                    boardId={board.id}
                  />
                ))}
              </motion.ul>
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
