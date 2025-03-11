'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserInitials } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/atoms";
import { logout } from "@/app/queries/auth";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoggedInNav() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await logout();
      if (response.ok) {
        router.push("/");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="space-x-4 hidden sm:flex">
            {NAV_LINKS.map((link) => (
              <Link href={link.href} legacyBehavior passHref key={link.href}>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), pathname === link.href ? "bg-gray-200 focus:bg-gray-200" : "")}>
                  {link.label}
                </NavigationMenuLink>
              </Link>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 border border-gray-300 rounded-full px-2 py-1">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="text-sm font-medium">
              {getUserInitials(user?.name || "")}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">{user?.name.split(" ")[0]}</p>
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="sm:hidden" asChild>
            <Link href="/home" className="w-full">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="sm:hidden" asChild>
            <Link href="/favourites" className="w-full">Favourites</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="sm:hidden" asChild>
            <Link href="/match" className="w-full">Match</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="sm:hidden" asChild>
            <Link href="/home#profile" className="w-full">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}