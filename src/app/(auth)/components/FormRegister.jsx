"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { registerSchema } from "@/lib/zod";
import { useState, useTransition } from "react";
import RegisterActions from "@/action/User";

export default function FormRegister() {
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  // Uso del hook useForm para manejar el estado del formulario
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Cuenta creada",
          description: "Tu cuenta ha sido creada exitosamente.",
          duration: 3000,
        });

        // Redirigir al usuario a la página de inicio de sesión
        router.push("/login");
      } else if (response.status === 409) {
        // Manejo de conflicto si el usuario ya existe
        toast({
          title: "Usuario ya existente",
          description: "Ya existe una cuenta con este correo electrónico.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            "Hubo un error al crear tu cuenta. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Hubo un error al crear tu cuenta. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
      console.error("Error al enviar el formulario", error);
    }
  };

  const handleSubmit = (formData) => {
    setError(null);
    startTransition(() => {
      const response = RegisterActions(formData);
      if (response.error) {
        setError(response.error);
        toast({
          title: "Error",
          description:
            "Hubo un error al registrar. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registro exitoso",
          description: "Su cuenta ha sido creada exitosamente.",
          duration: 3000,
        });
        router.push("/login");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid w-96 items-start gap-4"
      >
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input placeholder="Jackson Darwin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Sebastian Chavez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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

        <Button type="submit">Sign up</Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="hover:text-brand underline">
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
}
