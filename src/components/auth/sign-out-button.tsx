"use client";

import { signOut } from "next-auth/react";
import { memo } from "react";
import { redirect } from "next/navigation";

export const SignOutButton = memo(() => {
  return (
    <button
      onClick={async () => {
        await signOut();
        redirect("/");
      }}
    >
      Sign out
    </button>
  );
});

SignOutButton.displayName = "SignOutButton";
