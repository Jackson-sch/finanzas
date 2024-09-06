import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User/User";

import { compare } from "bcryptjs";

// TODO: Función para enviar la solicitud por correo
import { sendVerificationRequest } from "@/lib/authSendRequest";
import VerificationToken from "@/models/VerificationTokenSchema/VerificationToken";
import { nanoid } from "nanoid";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const email = credentials.email;
        const password = credentials.password;

        if (!email || !password) {
          throw new Error("Por favor, proporciona correo y contraseña.");
        }

        try {
          await dbConnect();

          const user = await User.findOne({ email }).select("+password +emailVerified");

          if (!user) {
            throw new Error("El correo electrónico no existe");
          }

          if (!user.password) {
            throw new Error("La cuenta no tiene contraseña");
          }

          const isMatched = await compare(password, user.password);

          if (!isMatched) {
            throw new Error("Contraseña incorrecta");
          }

          // Si el usuario no ha verificado su correo
          if (!user.emailVerified) {
            const verifyTokenExits = await VerificationToken.findOne({
              identifier: user.email,
            });

            // Si existe un token de verificación, lo eliminamos
            if (verifyTokenExits?.identifier) {
              await VerificationToken.findOneAndDelete({
                identifier: user.email,
              });
            }

            // Si no existe un token de verificación, lo creamos
            const token = nanoid();

            await VerificationToken.create({
              identifier: user.email,
              token,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 horas
            });

            // Enviamos el correo de verificación
            await sendVerificationRequest(user.email, token);

            throw new Error("Por favor, confirma tu correo. Se ha enviado un enlace de verificación.");
          
          }

          const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            id: user._id,
          };

          return userData;
          /* return user; */
        } catch (error) {
          throw new Error("Fallo de autenticación");
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.sub = user.id;
      }
      return token;
    },

    signIn: async ({ user, account }) => {

      try {
        await dbConnect();

        if (account.provider === "google") {
          const email = user.email;
          const name = user.name || "";
          const image = user.image;
          const authProviderId = user.id;

          // Dividir el nombre completo en partes
          const nameParts = name.split(" ");

          // Extraer el primer nombre (primer y segundo componente si hay al menos dos componentes)
          const firstName =
            nameParts.length > 1
              ? nameParts.slice(0, 2).join(" ") // Los dos primeros componentes
              : nameParts.join(" "); // Si hay menos de dos componentes, usa lo que queda

          // Extraer el apellido (últimos dos componentes si hay al menos cuatro componentes)
          const lastName =
            nameParts.length > 3
              ? nameParts.slice(-2).join(" ") // Los dos últimos componentes
              : nameParts.slice(2).join(" "); // Usa los componentes restantes si hay menos de cuatro

          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            await User.create({
              email,
              firstName: firstName || "",
              lastName: lastName || "",
              image,
              authProviderId,
            });
          }

          return true;
        }

        if (account.provider === "credentials") {
          return true;
        }

        return false;
      } catch (error) {
        console.error("Error en SignIn callback:", error);
        throw new Error("Error en SignIn callback");
      }
    },
  },

  events: {
    // El evento linkAccount se dispara cuando una cuenta (proveedor OAuth: GitHub, Google, Facebook, etc.)  se vincula a un usuario existente en tu base de datos.
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },

});
