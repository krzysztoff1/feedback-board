"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { memo } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

export const Nav = memo(() => {
  const params = useParams();

  if (!params.slug) {
    return null;
  }

  return (
    <NavigationMenu className="mb-8">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link
            href={`/dashboard/${String(params.slug)}`}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Overview
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={`/dashboard/${String(params.slug)}/customize`}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Customize
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
});

Nav.displayName = "Nav";
