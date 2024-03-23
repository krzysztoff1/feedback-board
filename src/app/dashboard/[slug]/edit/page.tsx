import Link from "next/link";
import { redirect } from "next/navigation";
import { EditBoardDescriptionForm } from "~/components/dashboard/edit-board-description-form";
import { EditBoardNameForm } from "~/components/dashboard/edit-board-name-form";
import { Button } from "~/components/ui/button";
import { SITE_URL } from "~/lib/constants";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

interface CustomizeProps {
  readonly params: {
    readonly slug: string;
  };
}

export default async function Customize({ params }: CustomizeProps) {
  const [session, board] = await Promise.all([
    getServerAuthSession(),
    api.boards.get.query({ slug: String(params.slug) }),
  ]);

  if (!board || !session || board.createdById !== session?.user.id) {
    redirect("/dashboard");
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <h1 className="block text-2xl font-bold">Edit {board.name}</h1>

        <Link
          href={
            process.env.VERCEL_ENV === "production"
              ? `https://${board.slug}.${SITE_URL.replace("https://", "")}`
              : `/dashboard/${board.slug}/view`
          }
          className="block"
        >
          <Button variant={"outline"}>View live</Button>
        </Link>
      </header>

      <div className="flex flex-col space-y-4">
        <div className="h-min rounded-lg border p-4">
          <EditBoardNameForm board={board} />
        </div>

        <div className="h-min rounded-lg border p-4">
          <EditBoardDescriptionForm board={board} />
        </div>
      </div>
    </div>
  );
}
