import { compare } from "bcryptjs";
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User/User";
import VerificationToken from "@/models/VerificationTokenSchema/VerificationToken";
import { sendVerificationRequest } from "@/lib/authSendRequest";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Por favor, proporciona correo y contraseña." });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email }).select("+password +emailVerified");

    if (!user) {
      return res.status(400).json({ error: "El correo electrónico no existe." });
    }

    if (!user.password) {
      return res.status(400).json({ error: "La cuenta no tiene contraseña." });
    }

    const isMatched = await compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ error: "Contraseña incorrecta." });
    }

    if (!user.emailVerified) {
      const existingToken = await VerificationToken.findOne({
        identifier: user.email,
      });

      if (existingToken) {
        await VerificationToken.findOneAndDelete({ identifier: user.email });
      }

      const token = nanoid();
      await VerificationToken.create({
        identifier: user.email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 horas
      });

      await sendVerificationRequest(user.email, token);

      return res.status(403).json({ error: "Por favor, confirma tu correo. Se ha enviado un enlace de verificación." });
    }

    // Eliminar selección de propiedades de seguridad
    user.password = undefined;
    user.emailVerified = undefined;

    return res.status(200).json(user);
  } catch (error) {
    console.error("Authorization handler error:", error);
    return res.status(500).json({ error: "Fallo de autenticación." });
  }
}
