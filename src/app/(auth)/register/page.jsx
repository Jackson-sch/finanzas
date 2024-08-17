"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Esquema de validación de formulario usando Zod
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "El nombre debe ser al menos 2 caracteres." }),
  lastName: z
    .string()
    .min(2, { message: "El apellido debe ser al menos 2 caracteres." }),
  email: z
    .string()
    .email({ message: "Dirección de correo electrónico no válida." }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe ser al menos 8 caracteres." }),
});

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
 // Uso del hook useForm para manejar el estado del formulario
  const form = useForm({
    resolver: zodResolver(formSchema),
  }); 

  // Función para manejar el envío del formulario
  const onSubmit = async (data) => {
    console.log(data);
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
      } else if (response.status === 409) { // Manejo de conflicto si el usuario ya existe
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
  

  return (
    <div className="container m-auto flex h-screen w-full max-w-lg flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Complete el formulario para crear su cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
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
        </CardContent>
      </Card>
    </div>
  );
}
