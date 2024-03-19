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
          <Link
            href="https://github.com/krzysztoff1/suggestli"
            aria-label="Github repository"
          >
            <Button variant="ghost" role="presentation">
              <Github className="h-4 w-4 text-primary/70" />
            </Button>
          </Link>

          <Link href="/auth/signin">
            <Button variant="secondary">Log in</Button>
          </Link>
        </nav>
      </header>
    </div>
  );
});

Header.displayName = "Header";
