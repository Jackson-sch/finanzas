import { compare } from "bcryptjs";
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User/User";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Por favor, proporciona correo y contraseña." });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email }).select("+password +emailVerified");

    if (!user) {
      return res.status(400).json({ error: "El correo electrónico no existe" });
    }

    if (!user.password) {
      return res.status(400).json({ error: "La cuenta no tiene contraseña" });
    }

    const isMatched = await compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ error: "Por favor, confirma tu correo electrónico para iniciar sesión." });
    }

    const userData = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error en authorize:", error);
    return res.status(500).json({ error: "Fallo de autenticación" });
  }
}