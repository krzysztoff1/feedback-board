import { getServerAuthSession } from "~/server/auth";
import { getProviders } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { AuthForm } from "~/components/auth/auth-form";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SITE_URL } from "~/lib/constants";

export default async function Page() {
  const [session, providers] = await Promise.all([
    getServerAuthSession(),
    getProviders(),
  ]);

  if (session) {
    return redirect("/dashboard");
  }
  const headersList = headers();

  const hostName = headersList.get("x-hostname") ?? "";
  const isSubdomain = hostName.split(".").length > 2;

  if (isSubdomain && process.env.VERCEL_ENV === "production") {
    const searchParams = new URLSearchParams();
    searchParams.append("targetHostName", hostName);

    redirect(`${SITE_URL}/auth/signin?${searchParams.toString()}`);
  }

  return (
    <main className="grid min-h-screen place-content-center">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm
            providers={providers}
            signInCallbackSearchParams={{ callback: String(true), hostName }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
