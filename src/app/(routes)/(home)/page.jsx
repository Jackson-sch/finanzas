import Navbar from "@/components/Home/Navbar/Navbar";
import React from "react";

export default function Homepage() {
  return (
    <div className="min-h-screen min-w-full">
      <Navbar />
      <div className="container mx-auto mt-8">
        <h1>Soy la página de inicio</h1>
      </div>
    </div>
  );
}
