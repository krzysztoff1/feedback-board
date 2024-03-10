import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { getServerAuthSession } from "~/server/auth";

export const AuthForm = async () => {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Link href="/api/auth/signin">
          <Button variant={"default"}>Discord</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
