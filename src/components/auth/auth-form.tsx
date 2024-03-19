"use client";

import { type getProviders, signIn } from "next-auth/react";
import { memo, useState } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface AuthFormProps {
  readonly providers: Awaited<ReturnType<typeof getProviders>>;
  readonly signInCallbackSearchParams?: Record<string, string>;
}

export const AuthForm = memo(
  ({ providers, signInCallbackSearchParams }: AuthFormProps) => {
    const [currentlySigningIn, setCurrentlySigningIn] = useState<string | null>(
      null,
    );

    return (
      <div className="flex flex-col gap-4">
        {Object.values(providers ?? {}).map((provider) => (
          <Button
            key={provider.id}
            onClick={async () => {
              setCurrentlySigningIn(provider.id);

              const pageSearchParams = new URLSearchParams(
                window.location.search,
              );
              const params = new URLSearchParams(signInCallbackSearchParams);

              if (pageSearchParams.get("targetHostName")) {
                params.append(
                  "targetHostName",
                  pageSearchParams.get("targetHostName")!,
                );
              }

              await signIn(provider.id, {
                callbackUrl: `/dashboard?${params.toString()}`,
              });
            }}
            variant={"default"}
            disabled={currentlySigningIn !== null}
            className="justify-between"
          >
            {currentlySigningIn === provider.id ? (
              <span className="flex items-center">
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <Image
                  src={`/providers/${provider.name.toLowerCase()}.svg`}
                  alt={`${provider.name} icon`}
                  width={24}
                  height={24}
                  className="mr-3"
                />
                Sign in with <strong className="ml-1">{provider.name}</strong>
              </span>
            )}
          </Button>
        ))}

        <Link href="/">
          <Button variant={"ghost"} size={"sm"}>
            Back to home
          </Button>
        </Link>
      </div>
    );
  },
);

AuthForm.displayName = "AuthForm";
