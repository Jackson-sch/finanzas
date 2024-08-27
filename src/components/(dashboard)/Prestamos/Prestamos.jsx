import { useCallback, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import RegisterForm from "./(Prestamos)/RegisterForm";
import DetailsLoan from "./(Prestamos)/DetailsLoan";
import PaymentsLoad from "./(Prestamos)/PaymentsLoad";
import PaymentHistory from "./(Prestamos)/PaymentHistory";
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

  const handleSubmitPayment = async (data) => {
    try {
      // Maneja la creación de nuevos pagos
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast({
          title: "Pago registrado",
          description: "El pago ha sido registrado exitosamente",
          status: "success",
        });
        setLoans([...loans, data]);
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error al registrar el pago",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error.message);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar el pago",
        status: "error",
      });
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between rounded-md bg-primary px-6 py-4 text-primary-foreground">
        <h1 className="text-2xl font-bold">Gestión de préstamos</h1>
      </header>
      <main className="flex-1 pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <RegisterForm onSubmit={handleSubmit} onSimulator={handleSimulator} />
          <DetailsLoan simulatorData={simulatorData} />
        </div>
        <Separator className="my-6" />
        {/* <div>
          <PaymentsLoad
            loans={loans}
            handleSubmitPayment={handleSubmitPayment}
          />
        </div> 
        <Separator className="my-6" />*/}
        <div className="mb-5">
          <ListLoans loans={loans} />
        </div>
        <Separator className="my-6" />
        {/* <div className="mb-5">
          <PaymentHistory loans={loans} />
        </div> */}
      </main>
    </div>
  );
}
