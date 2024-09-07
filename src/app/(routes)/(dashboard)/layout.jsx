import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NavbarDashboard from "@components/NavbarDashboard/NavbarDashboard";
import Sidebar from "@components/sidebar/Sidebar";

export default async function layout({ children }) {
  const session = await auth();

  if (!session) {
    // TODO: redirect to login
    redirect("/login");
  }

  return (
    <div className="flex h-full w-full">
      <div className="hidden h-full w-80 xl:fixed xl:block">
        <Sidebar />
      </div>
      <div className="h-full w-full xl:ml-80">
        <NavbarDashboard />
        <div className="h-max p-6">{children}</div>
      </div>
    </div>
  );
}
