import { useCallback, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import RegisterForm from "./(Prestamos)/RegisterForm";
import DetailsLoan from "./(Prestamos)/DetailsLoan";
import PaymentsLoad from "./(Prestamos)/PaymentsLoad";
import PaymentHistory from "./(Prestamos)/PaymentHistory";
import { fetchLoans } from "@/utils/fetchingData";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { useToast } from "@/components/ui/use-toast";

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

  const fetchLoansData = useCallback(async () => {
    // Obtén los datos de préstamos
  }, []);

  useEffect(() => {
    fetchLoansData();
  }, [fetchLoansData]);

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
      <main className="flex-1 pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <RegisterForm
            onSubmit={handleSubmit}
            onSimulator={handleSimulator}
            loans={loans}
          />
          {simulatorData && <DetailsLoan simulatorData={simulatorData} />}
        </div>
        <Separator className="my-6" />
        <div>
          <PaymentsLoad />
        </div>
        <Separator className="my-6" />
        <div>
          <PaymentHistory />
        </div>
      </main>
    </div>
  );
}
