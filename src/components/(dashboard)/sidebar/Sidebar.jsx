import SidebarRoutes from "./SidebarRoutes/SidebarRoutes";

export default function Sidebar() {
  return (
    <div className="h-screen">
      <div className="flex h-full flex-col border-r">
        <SidebarRoutes />
      </div>
    </div>
  );
}
