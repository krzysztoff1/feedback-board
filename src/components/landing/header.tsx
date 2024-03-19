import { memo } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Github } from "lucide-react";

export const Header = memo(() => {
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <header className="flex w-full max-w-4xl items-center justify-between p-4">
        <span className="text-md block font-bold text-primary">Suggestli</span>

        <nav className="align-center flex space-x-4">
          <Button variant="ghost" asChild>
            <Link
              href="https://github.com/krzysztoff1/suggestli"
              aria-label="Github repository"
            >
              <Github className="h-4 w-4 text-primary/70" />
            </Link>
          </Button>

          <Button variant="secondary" asChild>
            <Link href="/auth/signin">Log in</Link>
          </Button>
        </nav>
      </header>
    </div>
  );
});

Header.displayName = "Header";
