import { memo } from "react";
import { SignOutButton } from "./auth/sign-out-button";
import Link from "next/link";

export const TopBar = memo(() => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <h1 className="text-fore text-2xl font-bold">Feedback Board</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <SignOutButton />
        </div>
      </div>
    </header>
  );
});

TopBar.displayName = "TopBar";
