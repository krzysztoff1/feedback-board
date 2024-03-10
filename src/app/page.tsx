import { unstable_noStore as noStore } from "next/cache";
import { AuthForm } from "./_components/auth-form";

export default async function Home() {
  noStore();

  return (
    <main className="grid min-h-screen place-content-center">
      <AuthForm />
    </main>
  );
}
