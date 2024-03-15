import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Boards } from "../_components/dashboard/boards";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const hostName = String(searchParams.hostName) ?? "";
  const isCallback = Boolean(searchParams.callback);
  const isSubdomain = hostName.split(".").length > 2;

  if (isSubdomain && !isCallback) {
    const redirectUrl = new URL("/", `https://${hostName}`);
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
