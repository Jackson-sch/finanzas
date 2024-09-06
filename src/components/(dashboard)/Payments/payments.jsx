"use client";

import { useToast } from "@/components/ui/use-toast";
import { fetchLoans, fetchPayments } from "@/utils/fetchingData";
import React, { useEffect, useState } from "react";
import PaymentsLoad from "./PaymentsLoad";
import PaymentHistory from "./PaymentHistory";

export default function Payments({ session }) {
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansData = await fetchLoans();
        // Filtra los prestamos por usuario actual por su campo email
        const data = loansData.filter(
          (loan) => loan.email === session?.user?.email,
        );
        setLoans(data);

        const paymentsData = await fetchPayments();
        // Filtra los pagos que corresponden al usuario actual
        const filteredPayments = paymentsData.filter((payment) =>
          data.some((loan) => loan._id === payment.loanId),
        );
        setPayments(filteredPayments);
      } catch (error) {
        console.error("Error al obtener los préstamos:", error.message);
        toast({
          title: "Error",
          description: "No se pudieron obtener los datos de préstamos.",
          status: "error",
        });
      }
    };
    fetchData();
  }, [session]);

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
        const newPayment = await response.json();
        toast({
          title: "Pago registrado",
          description: "El pago ha sido registrado exitosamente",
          status: "success",
        });
        setPayments([...payments, newPayment]);
      } else {
        const errorData = await response.json();
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

  const deletePayment = async (id) => {
    try {
      const response = await fetch(`/api/payments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Ocurrió un error al eliminar el pago");
      }
      const updatedPayments = loans.filter((p) => p._id !== id);
      toast({
        title: "Pago eliminado",
        description: "El pago se ha eliminado correctamente",
        status: "success",
      });
      setLoans(updatedPayments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el pago",
        status: "error",
      });
    }
  };

  return (
    <div className="mx-auto space-y-8">
      <header className="flex items-center justify-between rounded-md bg-primary px-6 py-4 text-primary-foreground">
        <h1 className="text-2xl font-bold">Gestión pagos de préstamos</h1>
      </header>
      <main className="flex flex-col gap-4">
        <div>
          <PaymentsLoad
            loans={loans}
            payments={payments}
            handleSubmitPayment={handleSubmitPayment}
          />
        </div>
        <div>
          <PaymentHistory
            payments={payments}
            loans={loans}
            deletePayment={deletePayment}
          />
        </div>
      </main>
    </div>
  );
}
