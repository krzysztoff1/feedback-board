"use client";

import { type getProviders, signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { memo, useState } from "react";

interface AuthFormProps {
  providers: Awaited<ReturnType<typeof getProviders>>;
}

export const AuthForm = memo(({ providers }: AuthFormProps) => {
  const [currentlSignedIn, setCurrentlSignedIn] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {Object.values(providers ?? {}).map((provider) => (
        <Button
          key={provider.id}
          onClick={() => {
            setCurrentlSignedIn(provider.id);
            signIn(provider.id);
          }}
          variant={"default"}
          disabled={currentlSignedIn !== null}
        >
          {currentlSignedIn === provider.id ? (
            "Signing in..."
          ) : (
            <>
              Sign in with <strong className="ml-1">{provider.name}</strong>
            </>
          )}
        </Button>
      ))}
    </div>
  );
});

AuthForm.displayName = "AuthForm";
