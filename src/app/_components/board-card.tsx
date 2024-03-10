import Link from "next/link";
import { Card, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { getRelativeTimeString } from "~/lib/utils";

interface BoardCardProps {
  readonly name: string | null;
  readonly createdAt: Date;
  readonly href: string;
}

export const BoardCard = ({ name, href, createdAt }: BoardCardProps) => {
  return (
    <Card className="stretched-link-container">
      <CardHeader>
        <CardTitle>
          <Link href={href} className="stretched-link">
            {name ?? "Untitled"}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <p>
          Created: <time> {getRelativeTimeString(createdAt)}</time>
        </p>
      </CardFooter>
    </Card>
  );
};
