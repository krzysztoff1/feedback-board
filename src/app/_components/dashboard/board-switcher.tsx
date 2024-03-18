"use client";

import { Slash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { memo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";

export const BoardSwitcher = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const boards = api.boards.getAll.useQuery().data ?? [];
  const params = useParams();
  const board = boards.find((board) => board.slug === params.slug);

  if (!board) {
    return null;
  }

  return (
    <>
      <Slash className="h-4 w-4 -rotate-12 text-muted" />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant={"outline"}>{board?.name}</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2 p-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              onClick={() => setIsOpen(false)}
              href={`/dashboard/${board.slug}`}
              style={
                board.slug === params.slug
                  ? { pointerEvents: "none", opacity: 0.5 }
                  : {}
              }
              className="w-full"
            >
              <Button
                variant={board.slug === params.slug ? "secondary" : "ghost"}
                className="w-full"
              >
                {board.name}
              </Button>
            </Link>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
});

BoardSwitcher.displayName = "BoardSwitcher";
