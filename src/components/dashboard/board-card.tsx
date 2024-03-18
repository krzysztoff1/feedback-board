"use client";

import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { memo } from "react";
import { getRelativeTimeString } from "~/lib/utils";

interface BoardCardProps {
  readonly name: string | null;
  readonly href: string;
  readonly updatedAt: Date | null;
}

export const BoardCard = memo(({ name, href, updatedAt }: BoardCardProps) => {
  return (
    <Card className="stretched-link-container transiton-bg bg-card transition hover:bg-muted">
      <CardHeader>
        <CardTitle>
          <Link href={href} className="stretched-link">
            {name ?? "Untitled"}
          </Link>
        </CardTitle>
        <CardFooter>
          {updatedAt ? (
            <span className="text-foreground-muted">
              Last updated {getRelativeTimeString(updatedAt)}
            </span>
          ) : null}
        </CardFooter>
      </CardHeader>
    </Card>
  );
});

BoardCard.displayName = "BoardCard";
