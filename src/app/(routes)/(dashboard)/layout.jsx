import Navbar from "@/components/auth/Navbar";
import React from "react";

export default function layout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
