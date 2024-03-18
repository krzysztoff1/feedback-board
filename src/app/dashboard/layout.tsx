import { Nav } from "../_components/dashboard/nav";
import { TopBar } from "../_components/top-bar";

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <TopBar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Nav />
        {children}
      </main>
    </div>
  );
}
