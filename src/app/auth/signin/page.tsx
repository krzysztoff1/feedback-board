import { getServerAuthSession } from "~/server/auth";
import { getProviders } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "~/components/ui/card";
import { AuthForm } from "~/app/_components/auth/auth-form";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Page() {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("/");
  }

  const providers = await getProviders();
  const headersList = headers();
  const hostName = headersList.get("x-hostname") ?? "";
  const isSubdomain = hostName.split(".").length > 2;

  return (
    <main className="grid min-h-screen place-content-center">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm
            providers={providers}
            signInCallbackSearchParams={{
              isSubdomain: String(isSubdomain),
              callback: String(true),
              hostName,
            }}
          />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
