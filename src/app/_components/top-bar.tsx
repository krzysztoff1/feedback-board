"use client";

import { memo } from "react";
import { SignOutButton } from "./auth/sign-out-button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { BoardSwitcher } from "./dashboard/board-switcher";

export const TopBar = memo(() => {
  const session = useSession();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <span className="text-2xl font-bold text-foreground">
              Feedback Board
            </span>
          </Link>
          <BoardSwitcher />
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.data?.user?.image ?? ""}
                  alt="Profile picture"
                />
                <AvatarFallback>
                  {session.data?.user?.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/dashboard" passHref>
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/profile" passHref>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
});

TopBar.displayName = "TopBar";
