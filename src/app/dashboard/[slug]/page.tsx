import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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

  const board = await api.boards.get.query({
    slug: params.slug,
  });

  if (!board || !session || board.createdById !== session?.user.id) {
    redirect("/dashboard");
  }

  const suggestions = await api.suggestions.get.query({
    boardId: board?.id,
    offset: 0,
    page: 0,
  });

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">{board.name}</h1>

      <Link
        href={
          process.env.NODE_ENV === "production"
            ? `https://${board.slug}.goog.info`
            : `/view/${board.slug}`
        }
      >
        <Button variant={"link"}>View live</Button>
      </Link>

      <ul className="mt-4 flex flex-col gap-4">
        {suggestions.map(({ suggestions: suggestion, user }) => (
          <Card key={suggestion.id}>
            <CardHeader>
              <CardTitle>{suggestion.title}</CardTitle>
              <CardDescription>
                <p>{user?.name}</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{suggestion.content}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Created at {new Date(suggestion.createdAt).toLocaleString()}
              </p>
            </CardFooter>
          </Card>
        ))}
      </ul>
    </div>
  );
}
