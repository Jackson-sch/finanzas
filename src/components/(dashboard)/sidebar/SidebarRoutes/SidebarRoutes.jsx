"use client";

import { dataAdminSidebar, dataGeneralSidebar } from "./SidebarRoutes.data";
import SidebarItems from "./SidebarItem.jsx/SidebarItems";
/* import { isAdministrator } from "@/lib/isAdministrator"; */
import { Separator } from "@/components/ui/separator";

export default function SidebarRoutes() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="p-2 md:p-6">
          <p className="mb-2 text-foreground">GENERAL</p>
          {dataGeneralSidebar.map((item) => (
            <SidebarItems key={item.label} item={item} />
          ))}
        </div>

        {/* <Separator /> */}

        {/* <div className="p-2 md:p-6">
          <p className="mb-2 text-slate-500">ADMIN</p>
          {dataAdminSidebar.map((item) => (
            <SidebarItems key={item.label} item={item} />
          ))}
        </div> */}
      </div>
    </div>
  );
}
