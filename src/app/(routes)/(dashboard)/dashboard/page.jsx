import dynamic from "next/dynamic";

import { auth } from "@/auth";
const Dashboard = dynamic(
  () => import("@/components/(dashboard)/Dashboard/Dashboard"),
);

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <Dashboard session={session} />
      </div>
    </div>
  );
}
