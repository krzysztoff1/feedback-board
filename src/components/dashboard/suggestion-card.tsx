"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { memo } from "react";
import { type RouterOutput } from "~/server/api/root";

interface SuggestionCardProps {
  readonly suggestion: RouterOutput["suggestions"]["getAll"][number];
}

export const SuggestionCard = memo(({ suggestion }: SuggestionCardProps) => {
  return (
    <Card key={suggestion.id}>
      <CardHeader>
        <CardTitle>{suggestion.title}</CardTitle>
        <CardDescription>
          <p>{suggestion.user?.name}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{suggestion.content}</p>
      </CardContent>
    </Card>
  );
});

SuggestionCard.displayName = "SuggestionCard";
