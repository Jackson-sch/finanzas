"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={handleLogout}
    >
      <LogOutIcon className="h-5 w-5" />
    </Button>
  );
}
