"use server";

import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User/User";
import VerificationToken from "@/models/VerificationTokenSchema/VerificationToken";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { nanoid } from "nanoid";
import { sendVerificationRequest } from "@/lib/authSendRequest";

const registerActions = async (formData) => {
  try {
    const { firstName, lastName, email, password } = formData;

    if (!firstName || !lastName || !email || !password) {
      throw new Error("Por favor, completa todos los campos");
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("El correo electrónico ya existe");

    const hashedPassword = await hash(password, 12);

     await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Generar token de verificación
    const token = nanoid();
    await VerificationToken.create({
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    });

    // Enviar correo de verificación
    await sendVerificationRequest(email, token);

    return {
      success: true,
      message: "Por favor, verifica tu correo electrónico para completar el registro.",
    };
  } catch (error) {
    console.error("Error en registerActions:", error);
    return {
      error: error.message || "Error interno en el servidor. Por favor, intenta de nuevo.",
    };
  }
};

const loginAction = async (formData) => {
  const { email, password } = formData;

  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      return { error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en loginAction:", error);
    return {
      error: "Error interno en el servidor. Por favor, intenta de nuevo.",
    };
  }
};

const fetchAllUsers = async () => {
  await dbConnect();
  const users = await User.find({});
  return users;
};

export { loginAction, registerActions, fetchAllUsers };