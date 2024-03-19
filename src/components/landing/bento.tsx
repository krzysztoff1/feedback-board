import {
  DraftingCompassIcon,
  EyeIcon,
  Github,
  PaintBucket,
  TableColumnsSplit,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { SITE_URL } from "~/lib/constants";
import { cn } from "~/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3 ",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-transparent bg-card p-4 shadow-input transition duration-200 hover:shadow-xl dark:border-border dark:shadow-none",
        className,
      )}
    >
      {header}
      <div className="transition duration-200">
        {icon}
        <div className="mb-2 mt-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};

export const Features = () => {
  return (
    <div className="mb-96 mt-32 flex w-full flex-col items-center justify-start">
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="mb-2 text-2xl font-bold text-primary">
          Explore features
        </h2>
        <p className="max-w-md text-center text-white/90">
          {`Exchange ideas with your team, collect feedback, and keep track of what you're working on.`}
        </p>
      </div>
      <BentoGrid className="mx-auto max-w-4xl p-8">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            icon={item.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </div>
  );
};

const items = [
  {
    title: "Custom subdomain",
    description: `Create a unique subdomain for your board. e.g. yourcompany.${SITE_URL.replace("https://", "")}`,
    icon: <DraftingCompassIcon className="h-4 w-4 text-primary/70" />,
  },
  {
    title: "Open source",
    description: (
      <>
        Free and open source forever. <br />
        <Link
          href="https://github.com/krzysztoff1/suggestli"
          className="underline"
        >
          Star us on GitHub! 🌟
        </Link>
      </>
    ),
    icon: <Github className="h-4 w-4 text-primary/70" />,
  },
  {
    title: "Customizable",
    description: "Customize your board to match your brand",
    icon: <PaintBucket className="h-4 w-4 text-primary/70" />,
  },
  {
    title: "Roadmap",
    description:
      "Keep track of what you're working on and share it with the world",
    icon: <TableColumnsSplit className="h-4 w-4 text-primary/70" />,
  },
  {
    title: "Notifications",
    description:
      "Get notified when someone comments on your suggestion (coming soon).",
    icon: <EyeIcon className="h-4 w-4 text-primary/70" />,
  },
];
