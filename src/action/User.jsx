"use server";

import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User/User";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError, CredentialsSignin } from "next-auth";

const registerActions = async (formData) => {
  const firstName = formData.firstName;
  const lastName = formData.lastName;
  const email = formData.email;
  const password = formData.password;

  console.log("🚀 ~ Register ~ name:", firstName, lastName, email, password);

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
      if (result.error === "CredentialsSignin") {
        return { error: "Correo no registrado o contraseña incorrecta" };
      } else {
        return {
          error: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
        };
      }
    }
    return result;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};

const fetchAllUsers = async () => {
  await dbConnect();
  const users = await User.find({});
  return users;
};

export { loginAction, registerActions, fetchAllUsers };
