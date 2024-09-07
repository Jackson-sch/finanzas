"use client";

import Link from "next/link";
import { MountainIcon } from "lucide-react";

export default function NavbarHome() {


  return (
    <header className="flex h-16 w-full items-center justify-between bg-background px-4 md:px-6 border-[1px] shadow-sm">
      <nav className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
          prefetch={false}
        >
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Webby</span>
        </Link>
        <div className="hidden gap-6 text-sm font-medium md:flex">
          <Link href="/dashboard" className="text-foreground" prefetch={false}>
            Dashboard
          </Link>
        </div>
      </nav>
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="hidden rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-accent md:inline-flex"
          prefetch={false}
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-ring"
          prefetch={false}
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
