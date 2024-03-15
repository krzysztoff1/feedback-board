"use client";

import { type getProviders, signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { memo, useState } from "react";
import { Loader } from "lucide-react";

interface AuthFormProps {
  providers: Awaited<ReturnType<typeof getProviders>>;
  signInCallbackSearchParams: Record<string, string>;
}

export const AuthForm = memo(
  ({ providers, signInCallbackSearchParams }: AuthFormProps) => {
    const [currentlSignedIn, setCurrentlSignedIn] = useState<string | null>(
      null,
    );

    return (
      <div className="flex flex-col gap-4">
        {Object.values(providers ?? {}).map((provider) => (
          <Button
            key={provider.id}
            onClick={async () => {
              setCurrentlSignedIn(provider.id);

              const pageSearchParams = new URLSearchParams(
                window.location.search,
              );
              const params = new URLSearchParams(signInCallbackSearchParams);
              params.append(
                "targetHostName",
                pageSearchParams.get("targetHostName")!,
              );

              await signIn(provider.id, {
                callbackUrl: `/dashboard?${params.toString()}`,
              });
            }}
            variant={"default"}
            disabled={currentlSignedIn !== null}
          >
            {currentlSignedIn === provider.id ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in with <strong className="ml-1">{provider.name}</strong>
              </>
            )}
          </Button>
        ))}
      </div>
    );
  },
);

AuthForm.displayName = "AuthForm";
