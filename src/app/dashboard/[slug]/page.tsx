import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function BoardPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const board = await api.boards.get.query({
    slug: params.slug,
  });

  if (!board) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>{board.name}</h1>
      <Link
        href={
          process.env.NODE_ENV === "production"
            ? `https://${board.slug}.goog.info`
            : `/view/${board.slug}`
        }
      >
        <Button variant={"link"}>View live</Button>
      </Link>
    </div>
  );
}
