import { auth } from "@/auth";
import Payments from "@/components/Payments/Payments";

export default async function PaymentsPage() {
  const session = await auth();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="min-h-screen p-1 md:p-6">
      <div className="mx-auto">
        <Payments session={session} />
      </div>
    </div>
  );
}
