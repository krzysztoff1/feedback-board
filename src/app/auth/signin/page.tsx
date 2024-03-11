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

export default async function Page() {
  const session = await getServerAuthSession();

  if (session) {
    return { redirect: { destination: "/dashboard" } };
  }

  const providers = await getProviders();

  return (
    <main className="grid min-h-screen place-content-center">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          {" "}
          <AuthForm providers={providers} />{" "}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
