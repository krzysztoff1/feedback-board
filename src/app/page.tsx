import { unstable_noStore as noStore } from "next/cache";
import { getProviders } from "next-auth/react";
import { AuthForm } from "./_components/auth/auth-form";
import { headers } from "next/headers";

export default async function Home() {
  noStore();

  const headersList = headers();

  console.log("x-url", headersList.get("x-url"));
  console.log("x-hostname", headersList.get("x-hostname"));

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
