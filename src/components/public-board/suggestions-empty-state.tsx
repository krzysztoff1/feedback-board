"use client";

import { memo } from "react";
import { Button } from "../ui/button";
import { SITE_URL } from "~/lib/constants";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { CreateSuggestionModal } from "./create-suggestion-modal";

interface PublicBoardProps {
  readonly boardId: number;
  readonly isPreview: boolean;
}

export const SuggestionsEmptyState = memo(
  ({ boardId, isPreview }: PublicBoardProps) => {
    const session = useSession();
    const signInRedirectSearchParams = new URLSearchParams({
      targetHostName:
        typeof window === "undefined" ? "" : window.location.hostname,
    });

    return (
      <div className="mt-8 flex min-h-72 flex-col items-center justify-start gap-4">
        <strong className="text-xl font-bold">No suggestions yet</strong>
        <p className="text-balance text-center text-sm">
          Let your voice be heard! Create the first suggestion.
        </p>

        <CreateSuggestionModal
          isPreview={isPreview}
          isCta={true}
          boardId={boardId}
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
    );
  },
);

SuggestionsEmptyState.displayName = "SuggestionsEmptyState";
