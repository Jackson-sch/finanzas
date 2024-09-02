import PaymentHistory from "@/components/(dashboard)/Prestamos/(Prestamos)/PaymentHistory";
import PaymentsLoad from "@/components/(dashboard)/Prestamos/(Prestamos)/PaymentsLoad";
import { useToast } from "@/components/ui/use-toast";
import { fetchLoans, fetchPayments } from "@/utils/fetchingData";
import React, { useEffect, useState } from "react";

export default function Payments() {
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansData = await fetchLoans();
        setLoans(loansData);

        const paymentsData = await fetchPayments();
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error al obtener los préstamos:", error.message);
      }
    };
    fetchData();
  }, []);

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
        setPayments([...payments, data]);
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
    <div className="flex h-screen flex-col px-4">
      <header className="flex items-center justify-between rounded-md bg-primary px-6 py-4 text-primary-foreground">
        <h1 className="text-2xl font-bold">Gestión pagos de préstamos</h1>
      </header>
      <main className="flex flex-col gap-4 pt-6">
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
