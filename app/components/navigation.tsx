"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { CreditsDisplay } from "./navigation/credits-display";

const projectLinks = [
  {
    title: "Browse Projects",
    href: "/projects",
    description: "Discover and invest in innovative projects.",
  },
  {
    title: "Create Project",
    href: "/projects/new",
    description: "Launch your own project and raise funds.",
  },
  {
    title: "My Projects",
    href: "/projects/my",
    description: "View and manage your project portfolio.",
  },
];

const resourceLinks = [
  {
    title: "How It Works",
    href: "/#how-it-works",
    description: "Learn about our bonding curve mechanism.",
  },
  {
    title: "Documentation",
    href: "/docs",
    description: "Detailed guides and technical documentation.",
  },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/pionext_logoicon_blue.svg"
              alt="Pionext"
              width={24}
              height={24}
              priority
            />
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {projectLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                              pathname === link.href ? "bg-accent" : ""
                            }`}
                          >
                            <div className="text-sm font-medium leading-none">
                              {link.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {link.description}
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {resourceLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                              pathname === link.href ? "bg-accent" : ""
                            }`}
                          >
                            <div className="text-sm font-medium leading-none">
                              {link.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {link.description}
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <CreditsDisplay />
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex items-center space-x-2">
                      <UserCircle className="h-5 w-5" />
                      <span>{user.name}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-[200px] p-2">
                        <li>
                          <Link href="/profile" legacyBehavior passHref>
                            <NavigationMenuLink
                              className={`block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                pathname === "/profile" ? "bg-accent" : ""
                              }`}
                            >
                              Profile
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => logout()}
                            className="w-full text-left block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            Sign Out
                          </button>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}