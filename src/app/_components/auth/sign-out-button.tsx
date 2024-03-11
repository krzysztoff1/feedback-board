"use client";

import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";
import { memo } from "react";
import { redirect } from "next/navigation";

export const SignOutButton = memo(() => {
  return (
    <Button
      onClick={async () => {
        await signOut();
        redirect("/");
      }}
      variant={"ghost"}
    >
      Sign out
    </Button>
  );
});

SignOutButton.displayName = "SignOutButton";
