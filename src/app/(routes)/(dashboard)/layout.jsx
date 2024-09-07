import { auth } from "@/auth";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { redirect } from "next/navigation";

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
        <Navbar />
        <div className="h-max p-6">{children}</div>
      </div>
    </div>
  );
}
