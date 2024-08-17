import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { dbConnect } from "./lib/mongoose";
import User from "./models/User/User";

export const { handlers, singIn, signOut, auth } = NextAuth({
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
        const { email, password } = credentials;

        if (!email || !password) {
          throw new CredentialsSignin("Please provide email and password");
        }

        try {
          await dbConnect();
          console.log("⚡ Database connected");
        } catch (error) {
          console.log("🚀 ~ Error connecting to database:", error);
        }

        const user = await User.findOne({ email }).select("+password +role");

        if (!user) {
          throw new Error("Email not found");
        }
        if (!user.password) {
          throw new Error("Password not found");
        }
        return user;
      },
    }),
  ],
});
