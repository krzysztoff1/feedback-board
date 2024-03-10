import Link from "next/link";
import { Button } from "~/components/ui/button";

export const TopBar = () => {
  return (
    <header className="sticky top-0 flex h-16 w-screen">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-fore text-2xl font-bold">Feedback Board</h1>
        <div className="flex items-center space-x-4">
          <Link href="/api/auth/signout">
            <Button variant="ghost">Logout</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
