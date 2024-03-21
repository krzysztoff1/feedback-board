"use client";

import { type RouterOutput } from "~/server/api/root";
import { memo, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { PAGE_SIZE, SITE_URL } from "~/lib/constants";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { CreateSuggestionModal } from "./create-suggestion-modal";
import { Suggestion } from "./suggestion";
import { type PaginationState } from "@tanstack/react-table";
import { SuggestionsEmptyState } from "./suggestions-empty-state";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";

interface PublicBoardProps {
  readonly board: RouterOutput["boards"]["getBoardData"]["board"];
  readonly initialSuggestions: RouterOutput["suggestions"]["get"];
  readonly isPreview: boolean;
  readonly themeCSS?: string;
}

export const PublicBoard = memo(
  ({
    board,
    initialSuggestions,
    isPreview,
    themeCSS = "",
  }: PublicBoardProps) => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE,
    });
    const session = useSession();
    const params = useParams();
    const suggestions = api.suggestions.get.useQuery(
      {
        pageSize: pagination.pageSize,
        page: pagination.pageIndex,
        slug: String(params.slug),
      },
      {
        keepPreviousData: true,
        initialData: initialSuggestions,
      },
    ).data;

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
          <header className="flex w-full flex-row items-center justify-between gap-4 border-border bg-card p-4 sm:rounded-lg sm:border">
            <h1 className="text-2xl font-bold">{board.name}</h1>
            <div className="flex items-center gap-4">
              {suggestions?.length > 0 ? (
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
                  href={`${process.env.NODE_ENV === "production" ? SITE_URL : ""}/auth/signin?${new URLSearchParams(
                    {
                      targetHostName:
                        typeof window === "undefined"
                          ? ""
                          : window.location.hostname,
                    },
                  ).toString()}`}
                >
                  <Button variant={"default"}>Sign in</Button>
                </Link>
              ) : null}
            </div>
          </header>

          <div className="w-full">
            {suggestions?.length === 0 ? (
              <SuggestionsEmptyState boardId={board.id} isPreview={isPreview} />
            ) : (
              <ul className="flex w-full flex-col">
                {suggestions?.map((suggestion) => (
                  <Suggestion
                    key={suggestion.id}
                    suggestion={suggestion}
                    isPreview={isPreview}
                    boardId={board.id}
                  />
                ))}
              </ul>
            )}
          </div>

          <footer className="mb-40 flex w-full flex-row items-center justify-between gap-4">
            <span className="block h-min py-1 text-sm opacity-70">
              Viewing {pagination.pageIndex * pagination.pageSize + 1}–
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                board.suggestionsCount,
              )}{" "}
              of {board.suggestionsCount} results
              <br />
              <Link href={SITE_URL} target="_blank" passHref>
                Powered by
                <strong className="ml-1">Suggestli</strong>
              </Link>
            </span>

            <div
              className={cn("flex items-center justify-end space-x-2", {
                hidden: board.suggestionsCount <= pagination.pageSize,
              })}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.max(prev.pageIndex - 1, 0),
                  }))
                }
                disabled={pagination.pageIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.min(
                      prev.pageIndex + 1,
                      Math.ceil(board.suggestionsCount / prev.pageSize) - 1,
                    ),
                  }))
                }
                disabled={
                  pagination.pageIndex ===
                  Math.ceil(board.suggestionsCount / pagination.pageSize) - 1
                }
              >
                Next
              </Button>
            </div>
          </footer>
        </main>
      </>
    );
  },
);

PublicBoard.displayName = "PublicBoard";
