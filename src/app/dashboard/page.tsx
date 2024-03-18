import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Boards } from "../_components/dashboard/boards";
import { SITE_URL } from "~/lib/constants";

interface DashboardProps {
  readonly searchParams: Record<string, string | string[] | undefined>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const targetHostName = String(searchParams.targetHostName) ?? "";
  const isSubdomainValid =
    targetHostName.split(".").length > 2 && targetHostName !== "";
  const returnToBoard = searchParams.returnToBoard
    ? String(searchParams.returnToBoard)
    : "";

  if (returnToBoard) {
    const prodReturnUrl = new URL(
      "/",
      `https://${returnToBoard}.${SITE_URL.replace("https://", "")}`,
    );

    const redirectUrl =
      process.env.NODE_ENV === "production"
        ? prodReturnUrl.href
        : `/view/${returnToBoard}`;

    redirect(redirectUrl);
  }

  if (isSubdomainValid) {
    const redirectUrl = new URL("/", `https://${targetHostName}`);

    for (const [key, value] of Object.entries(searchParams)) {
      if (key !== "hostName" && value) {
        redirectUrl.searchParams.set(key, String(value));
      }
    }

    redirect(redirectUrl.href);
  }

  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userBoards = await api.boards.getAll.query();

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="flex flex-col gap-4 sm:gap-8">
        <Boards userBoards={userBoards} />
      </div>
    </>
  );
}
