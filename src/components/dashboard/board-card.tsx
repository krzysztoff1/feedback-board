"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { memo } from "react";
import { getRelativeTimeString } from "~/lib/utils";

interface BoardCardProps {
  readonly name: string | null;
  readonly href: string;
  readonly createdAt: Date | null;
}

export const BoardCard = memo((props: BoardCardProps) => {
  return (
    <Card className="stretched-link-container transiton-bg bg-card transition hover:bg-muted">
      <CardHeader>
        <CardTitle>
          <Link href={props.href} className="stretched-link">
            {props.name ?? "Untitled"}
          </Link>
        </CardTitle>
        <CardContent className="p-0">
          {props.createdAt ? (
            <span className="text-foreground-muted/70 text-sm">
              Created {getRelativeTimeString(props.createdAt)}
            </span>
          ) : null}
        </CardContent>
      </CardHeader>
    </Card>
  );
});

BoardCard.displayName = "BoardCard";
