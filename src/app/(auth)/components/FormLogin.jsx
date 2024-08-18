"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { useToast } from "@/components/ui/use-toast";
import { loginSchema } from "@/lib/zod";
import { loginAction } from "@/action/User";
import { useState, useTransition } from "react";

export default function FormLogin({ isVerified, OAuthAccountNotLinked }) {
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    setError(null);
    startTransition(async () => {
      const response = await loginAction(formData);
      if (response.error) {
        setError(response.error);
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente.",
          duration: 3000,
        });
        // Redirigir manualmente si es necesario
        router.push("/dashboard");
      }
    });
  };
  


  return (
    <div>
      {isVerified && (
        <p className="mb-5 text-center text-sm text-green-500">
          Email verified, you can now login
        </p>
      )}
      {OAuthAccountNotLinked && (
        <p className="mb-5 text-center text-sm text-red-500">
          To confirm your identity, sign in with the same account you used
          originally.
        </p>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-96 items-start gap-4"
        >
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Sign in</Button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="hover:text-brand underline">
              Register
            </Link>
          </p>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex w-full items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              
            >
              <IconBrandGithub />
              Sign in with Github
            </Button>

              <Button type="submit" variant="secondary">
                <IconBrandGoogleFilled stroke={1} />
                Sign in with Google
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
