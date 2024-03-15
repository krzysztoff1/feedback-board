import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Boards } from "../_components/dashboard/boards";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const targetHostName = String(searchParams.targetHostName) ?? "";
  const isSubdomainValid =
    targetHostName.split(".").length > 2 && targetHostName !== "";

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
    redirect("/");
  }

  const userBoards = await api.boards.getAll.query();

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <Boards userBoards={userBoards} />
    </div>
  );
}
