import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    // Aquí podrías generar un token JWT o manejar la sesión como prefieras
    // const token = generateToken(user);

    return NextResponse.json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.log("🚀 ~ Error al iniciar sesión:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
