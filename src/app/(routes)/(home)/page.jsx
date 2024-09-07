import NavbarHome from "@/components/Navbar/NavbarHome";

export default function HomePage() {
  return (
    <div className="min-h-screen min-w-full">
      <NavbarHome />
      <div className="container mx-auto mt-8">
        <h1>Soy la página de inicio</h1>
      </div>
    </div>
  );
}
