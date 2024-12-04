"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
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

            <NavigationMenuItem>
              <Link href="https://forms.gle/Hm1peh3wetLsKg56A" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Join Waitlist
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}