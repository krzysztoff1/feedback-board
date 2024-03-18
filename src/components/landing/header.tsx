import { memo } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export const Header = memo(() => {
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <header className="flex w-full max-w-4xl items-center justify-between p-4">
        <span className="text-md block font-bold text-primary">Suggestli</span>

        <div>
          <Link href="/auth/signin">
            <Button variant="secondary">Log in</Button>
          </Link>
        </div>
      </header>
    </div>
  );
});

Header.displayName = "Header";
