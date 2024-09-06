// src/auth.jsx
import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
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
  },
  events: {
    async linkAccount({ user }) {
      const res = await fetch("/api/auth/link-account", {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        console.error("Error linking account");
      }
    },
  },
});