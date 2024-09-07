import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from "react";
import { Menu } from "lucide-react";

import LogoutButton from "@/app/(auth)/components/LogoutButton";
import { DropdownProfile } from "./DropdownProfile";
import SidebarRoutes from "../Sidebar/SidebarRoutes";

export default function NavbarDashboard() {
  return (
    <nav className="item-center flex h-20 w-full justify-between gap-x-4 border-b bg-background px-2 md:px-6">
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger className="mt-4 flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <SidebarRoutes />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex w-full items-center justify-end gap-x-2">
        <DropdownProfile />
        <LogoutButton />
      </div>
    </nav>
  );
}
