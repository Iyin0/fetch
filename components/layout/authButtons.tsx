'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthButtons() {
  const pathname = usePathname();
  return (
    <div>
      <Link
        href="/"
        className={cn("border border-gray-300 rounded px-4 py-1 w-fit hidden text-sm", pathname === "/signup" && "block")}
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className={cn("border border-gray-300 rounded px-4 py-1 w-fit hidden text-sm", pathname === "/" && "block")}
      >
        Sign Up
      </Link>
    </div>
  );
}
