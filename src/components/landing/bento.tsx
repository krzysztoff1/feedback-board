import {
  Clipboard,
  EyeIcon,
  FileIcon,
  SignalIcon,
  TableColumnsSplit,
} from "lucide-react";
import React from "react";
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
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-transparent bg-white p-4 shadow-input transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
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
        <h3 className="mb-2 text-2xl font-bold text-primary">Some features</h3>
        <p className="max-w-md text-center text-white/90">
          Here are some features of Suggestli
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
    description: "Create a unique subdomain for your board.",
    icon: <Clipboard className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Open source",
    description: "Free and open source forever. Self-host or use our cloud.",
    icon: <FileIcon className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Customizable",
    description: "Customize your board to fit your brand.",
    icon: <SignalIcon className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "View all suggestions in one place",
    description: "View all suggestions in one place",
    icon: <TableColumnsSplit className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Dark mode",
    description: "It's easy on the eyes",
    icon: <EyeIcon className="h-4 w-4 text-neutral-500" />,
  },
];
