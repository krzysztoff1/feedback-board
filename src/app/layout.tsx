import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { NextAuthProvider } from "~/providers/next-auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Feedback board",
  description: "A feedback board for your team",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "dark min-h-screen bg-background font-sans antialiased transition-colors duration-200 ease-in-out",
          inter.className,
        )}
      >
        <NextAuthProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
