import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";

export default function page() {
  return (
    <div className="container m-auto flex h-screen w-full max-w-lg flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder a su cuenta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid w-96 items-start gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="shadcn@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" placeholder="password" type="password" />
            </div>
            <Button type="submit">Sign in</Button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="hover:text-brand underline">
                Register
              </Link>
            </p>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <div className="flex w-full flex-col items-center justify-center space-y-4">
              <section className="flex flex-col space-y-4">
                <form>
                  <Button type="submit" variant="outline">
                    <IconBrandGithub />
                    Sign in with Github
                  </Button>
                </form>
              </section>
              <section className="flex flex-col space-y-4">
                <form>
                  <Button type="submit" variant="secondary">
                    <IconBrandGoogleFilled stroke={1} />
                    Sign in with Google
                  </Button>
                </form>
              </section>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
