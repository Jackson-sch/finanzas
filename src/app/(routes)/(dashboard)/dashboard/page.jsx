import { auth } from "@/auth";
import PanelDashboard from "@/components/Dashboard/PanelDashboard";



export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="min-h-screen p-1 md:p-6">
      <div className="mx-auto">
        <PanelDashboard session={session} />
      </div>
    </div>
  );
}
