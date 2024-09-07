import { auth } from "@/auth";
import Prestamos from "@components/Prestamos/Prestamos";


export default async function LoansPage() {
  const session = await auth();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        <Prestamos session={session} />
      </div>
    </div>
  );
}
