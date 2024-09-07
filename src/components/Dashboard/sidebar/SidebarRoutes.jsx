"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataGeneralSidebar } from "./DataLinks";

export default function SidebarRoutes() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="p-2 md:p-6">
          <p className="mb-2 text-foreground">GENERAL</p>
          {DataGeneralSidebar.map((item) => (
            <SidebarItems key={item.label} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SidebarItems({ item }) {
  const { href, label, icon: Icon } = item;

  const pathname = usePathname();
  const activePath = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        `mt-2 flex cursor-pointer items-center gap-x-2 rounded-lg p-2 text-sm text-slate-700 hover:bg-slate-300/20`,
        activePath && "bg-slate-400/20",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1} />
      {label}
    </Link>
  );
}
