"use server";

import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User/User";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

const registerActions = async (formData) => {
  const { firstName, lastName, email, password } = formData;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("Por favor, completa todos los campos");
  }

  await dbConnect();

  // Verifica si el usuario ya existe
  const existingUser = await User.findOne({ email });

  if (existingUser) throw new Error("El correo electrónico ya existe");

  const hashedPassword = await hash(password, 12);

  await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
 /*  redirect("/login"); */

  // Autenticar al usuario
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return { success: true };
};

const loginAction = async (formData) => {
  const email = formData.email;
  const password = formData.password;

  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    // Verifica si hubo un error en la autenticación
    if (result?.error) {
      const errorMessage =
        result.error === "CredentialsSignin"
          ? "Correo no registrado o contraseña incorrecta"
          : "Ocurrió un error inesperado. Por favor, intenta de nuevo.";
      return { error: errorMessage };
    }
    return result;
  } catch (error) {
    return {
      error:
        error.message ||
        "Error interno en el servidor. Por favor, intenta de nuevo.",
    };
  }
};

const fetchAllUsers = async () => {
  await dbConnect();
  const users = await User.find({});
  return users;
};

export { loginAction, registerActions, fetchAllUsers };
