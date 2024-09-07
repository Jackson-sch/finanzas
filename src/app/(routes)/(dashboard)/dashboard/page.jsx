import { auth } from "@/auth";
import PanelDashboard from "@components/Dashboard/PanelDashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <PanelDashboard session={session} />
      </div>
    </div>
  );
}