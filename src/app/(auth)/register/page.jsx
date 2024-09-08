
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import FormRegister from "../components/FormRegister";

export default function Register() {

  return (
    <div className="container m-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
          <CardDescription>
            Complete el formulario para crear su cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormRegister />
        </CardContent>
      </Card>
    </div>
  );
}
