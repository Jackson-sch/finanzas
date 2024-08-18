import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";

import FormLogin from "../components/FormLogin";

export default async function LoginPage({ searchParams }) {
  const isVerified = searchParams.verified === "true";
  const OAuthAccountNotLinked = searchParams.error === "OAuthAccountNotLinked";

  const session = await getSession();
  const user = session?.user;
  if (user) redirect("/dashboard");
  
  return (
    <div className="container m-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder a su cuenta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormLogin
            isVerified={isVerified}
            OAuthAccountNotLinked={OAuthAccountNotLinked}
          />
        </CardContent>
      </Card>
    </div>
  );
}
