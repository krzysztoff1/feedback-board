"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { memo } from "react";

interface BoardCardProps {
  readonly name: string | null;
  readonly href: string;
}

export const BoardCard = memo(({ name, href }: BoardCardProps) => {
  return (
    <Card className="stretched-link-container transiton-bg bg-card transition hover:bg-muted">
      <CardHeader>
        <CardTitle>
          <Link href={href} className="stretched-link">
            {name ?? "Untitled"}
          </Link>
        </CardTitle>
      </CardHeader>
    </Card>
  );
});

BoardCard.displayName = "BoardCard";
