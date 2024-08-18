"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };
  return <Button onClick={handleLogout}>LogOut</Button>;
}
