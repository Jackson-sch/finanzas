"use client";

import { useEffect, useState } from "react";

import { fetchLoans } from "@/utils/fetchingData";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";

import ListLoans from "./ListLoans";
import { toast } from "@/components/ui/use-toast";
import RegisterForm from "./LoanForm";
import DetailsLoan from "./DetailsLoan";

export default function Prestamos({ session }) {
  const [loans, setLoans] = useState([]);
  const [simulatorData, setSimulatorData] = useState(null);

  const handleApiRequest = async (url, method, data = null) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url, options);

    if (!response.ok) throw new Error("Error en la respuesta de la API");
    return response.json();
  };

  const handleLoan = async (
    method,
    url,
    data = null,
    successTitle,
    successDescription,
  ) => {
    try {
      const loan = await handleApiRequest(url, method, data);
      toast({
        title: successTitle,
        description: successDescription,
        status: "success",
      });
      return loan;
    } catch (error) {
      console.error("Error al registrar el préstamo:", error.message);
      toast({
        title: "Error en la respuesta de la API",
        description:
          "Ocurrió un error al registrar el préstamo" + error.message,
        status: "error",
      });
    }
  };

  const handleSubmit = async (data) => {
    const loan = await handleLoan(
      "POST",
      "/api/loans",
      data,
      "Préstamo registrado",
      "El préstamo ha sido registrado exitosamente",
    );
    if (loan) {
      setLoans([...loans, loan]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansData = await fetchLoans();
        // Filtra los prestamos por usuario actual por su campo email
        const loansDataFiltered = loansData.filter(
          (loan) => loan.email === session?.user?.email,
        );
        setLoans(loansDataFiltered);
      } catch (error) {
        console.error("Error al obtener los préstamos:", error.message);
      }
    };
    fetchData();
  }, [session?.user?.email]);

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

  // Función para eliminar un préstamo
  const deleteLoan = async (id) => {
    const success = await handleLoan(
      "DELETE",
      `/api/loans/${id}`,
      null,
      "Préstamo eliminado",
      "El prestatario ha sido eliminado exitosamente",
    );

    if (success) {
      const updatedLoans = loans.filter((loan) => loan._id !== id);
      setLoans(updatedLoans);
    }
  };

  return (
    <div className="mx-auto space-y-8">
      <header className="flex items-center justify-between rounded-md bg-primary px-6 py-4 text-primary-foreground">
        <h1 className="text-xl font-bold md:text-2xl">Gestión de préstamos</h1>
      </header>
      <main className="flex-1 gap-4">
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          <div className="col-span-1 w-full">
            <RegisterForm
              onSubmit={handleSubmit}
              onSimulator={handleSimulator}
              session={session}
            />
          </div>
          <div>
            <DetailsLoan simulatorData={simulatorData} />
          </div>
        </div>

        <div className="mt-6">
          <ListLoans loans={loans} deleteLoan={deleteLoan} />
        </div>
      </main>
    </div>
  );
}
