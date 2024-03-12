import { unstable_noStore as noStore } from "next/cache";
import { getProviders } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { AuthForm } from "./_components/auth/auth-form";

export default async function Home() {
  noStore();

  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  const providers = await getProviders();

  return (
    <main className="grid min-h-screen place-content-center">
      <section className="mb-8">
        <h1 className="text-center text-3xl font-bold">Feedback Board</h1>
      </section>
      <AuthForm providers={providers} />
    </main>
  );
}
