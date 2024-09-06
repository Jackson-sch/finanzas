import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User/User";
import VerificationToken from "@/models/VerificationTokenSchema/VerificationToken";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect(); // Conectar a la base de datos

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verificar el token de verificación
  const verifyToken = await VerificationToken.findOne({ token });

  if (!verifyToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verificar si el token ha expirado
  if (verifyToken.expired) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 });
  }

  // Verificar si el email ya ha sido verificado
  const user = await User.findOne({ email: verifyToken.identifier });
  if (user?.emailVerified) {
    return NextResponse.json({ error: "Email already verified" }, { status: 400 });
  }

  // Marcar el email como verificado
  await User.updateOne(
    { email: verifyToken.identifier },
    { emailVerified: true }
  );

  // Eliminar el token de verificación
  await VerificationToken.deleteOne({ _id: verifyToken._id });

  // Redirigir al usuario a la página de inicio de sesión con un mensaje de éxito
  return NextResponse.redirect(new URL("/login?verified=true", req.url));
}
