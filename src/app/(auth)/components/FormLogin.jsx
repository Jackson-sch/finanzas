"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function FormLogin({ isVerified, OAuthAccountNotLinked }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente.",
          duration: 3000,
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {isVerified && (
        <p className="mb-5 text-center text-sm text-green-500">
          Correo electrónico verificado, ahora puede iniciar sesión
        </p>
      )}
      {OAuthAccountNotLinked && (
        <p className="mb-5 text-center text-sm text-red-500">
          Para confirmar su identidad, inicie sesión con la misma cuenta que usó para registrarse originalmente.
        </p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </Form>
      <p className="my-4 text-center text-sm text-gray-500">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Registrar
        </Link>
      </p>
    </div>
  );
}