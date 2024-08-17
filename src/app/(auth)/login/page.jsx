"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { useToast } from "@/components/ui/use-toast";

// Esquema de validación de formulario usando Zod
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Dirección de correo electrónico no válida." }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe ser al menos 8 caracteres." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  // Uso del hook useForm para manejar el estado del formulario
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente.",
          duration: 3000,
        });

        // Redirigir al usuario a la página de inicio o dashboard
        router.push("/dashboard");
      } else if (response.status === 401) {
        toast({
          title: "Error",
          description: "Contraseña incorrecta. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      } else if (response.status === 404) {
        toast({
          title: "Error",
          description: "Usuario no encontrado. Por favor, verifica tu correo.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            "Hubo un error al iniciar sesión. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Hubo un error al iniciar sesión. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
      console.error("Error al enviar el formulario", error);
    }
  };

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
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
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
                <section>
                  <form>
                    <Button type="submit" variant="outline">
                      <IconBrandGithub />
                      Sign in with Github
                    </Button>
                  </form>
                </section>
                <section>
                  <form>
                    <Button type="submit" variant="secondary">
                      <IconBrandGoogleFilled stroke={1} />
                      Sign in with Google
                    </Button>
                  </form>
                </section>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
