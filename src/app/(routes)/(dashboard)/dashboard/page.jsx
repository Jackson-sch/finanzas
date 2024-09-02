import { auth } from "@/auth";
import DashboardPage from "@/components/(dashboard)/Dashboard/Dashboard";


export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 ">
        <DashboardPage />
      </div>
    </div>
  );
}
