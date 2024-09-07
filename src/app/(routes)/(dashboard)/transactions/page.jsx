import { auth } from "@/auth";
import Transaction from "@/components/Dashboard/Transaction/Transaction";

export default async function TransactionPage() {
  const session = await auth();

  if (!session) {
    return <div>Not logged in</div>;
  }
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        <Transaction session={session} />
      </div>
    </div>
  );
}
