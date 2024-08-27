import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User/User";

import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

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
          throw new Error("Please provide email and password");
        }

        try {
          await dbConnect();
          console.log("⚡ Database connected");

          const user = await User.findOne({ email }).select("+password +role");

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

          const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            id: user._id,
          };

          return userData;
        } catch (error) {
          console.log("🚀 ~ Error en las credenciales de autorización:", error);
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
      console.log("🚀 ~ signIn: ~ user:", { user, account });

      try {
        await dbConnect();

        if (account.provider === "google" || account.provider === "github") {
          const email = user.email;
          const name = user.name || "";
          const image = user.image;
          const authProviderId = user.id;

      // Dividir el nombre completo en partes
  const nameParts = name.split(" ");

  // Extraer el primer nombre (primer y segundo componente si hay al menos dos componentes)
  const firstName = nameParts.length > 1 
    ? nameParts.slice(0, 2).join(" ") // Los dos primeros componentes
    : nameParts.join(" "); // Si hay menos de dos componentes, usa lo que queda

  // Extraer el apellido (últimos dos componentes si hay al menos cuatro componentes)
  const lastName = nameParts.length > 3 
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
});
