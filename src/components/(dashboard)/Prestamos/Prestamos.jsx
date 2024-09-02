/**
 * El componente de la función 'Prestamos' gestiona el registro de préstamos, la simulación y la visualización dentro de un préstamo
* Sistema de gestión en una aplicación React.
* @returns El componente `prestamos` se está devueltos.Es un componente funcional que gestiona el préstamo
* Datos e incluye un formulario para registrar nuevos préstamos, un simulador de préstamos y una lista de préstamos existentes.
* El componente obtiene datos de préstamos sobre el montaje utilizando `UseEffect` y maneja el registro de préstamos y
* Cálculos del simulador a través de varias funciones.La estructura del componente incluye un encabezado para préstamo
* Gestión, una sección principal con un formulario
 */
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import RegisterForm from "./(Prestamos)/RegisterForm";
import DetailsLoan from "./(Prestamos)/DetailsLoan";
import { fetchLoans } from "@/utils/fetchingData";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { useToast } from "@/components/ui/use-toast";
import ListLoans from "./(Prestamos)/ListLoans";

export default function Prestamos() {
  const [loans, setLoans] = useState([]);
  const [simulatorData, setSimulatorData] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (data) => {
    try {
      // Maneja la creación de nuevos préstamos
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast({
          title: "Préstamo registrado",
          description: "El préstamo ha sido registrado exitosamente",
          status: "success",
        });
        setLoans([...loans, data]);
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error al registrar el préstamo",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error al registrar el préstamo:", error.message);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar el préstamo",
        status: "error",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansData = await fetchLoans();
        setLoans(loansData);
      } catch (error) {
        console.error("Error al obtener los préstamos:", error.message);
      }
    };
    fetchData();
  }, []);

  const handleSimulator = (formValues) => {
    try {
      const simulatorData = calculateSimulatorData(formValues);
      setSimulatorData(simulatorData);
    } catch (error) {
      console.error(
        "Error al calcular los datos del simulador:",
        error.message,
      );
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between rounded-md bg-primary px-6 py-4 text-primary-foreground">
        <h1 className="text-2xl font-bold">Gestión de préstamos</h1>
      </header>
      <main className="flex-1 pt-6 gap-4 ">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <RegisterForm onSubmit={handleSubmit} onSimulator={handleSimulator} />
          <DetailsLoan simulatorData={simulatorData} />
        </div>

        <div className="mb-5 mt-6">
          <ListLoans loans={loans} />
        </div>
      </main>
    </div>
  );
}
