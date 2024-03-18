import { api } from "~/trpc/server";
import { Nav } from "../_components/dashboard/nav";
import { TopBar } from "../_components/top-bar";

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen">
      <TopBar boardsPromise={api.boards.getAll.query()} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Nav />
        {children}
      </main>
    </div>
  );
}
