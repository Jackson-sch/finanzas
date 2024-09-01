import { CardComponent } from "@/components/CardComponent";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";
import { format, isAfter, subDays } from "date-fns"; // Importa las funciones necesarias de date-fns
import { es } from "date-fns/locale"; // Importa la localización en español

export default function LatestTransactions({ transactions }) {
  // Calcula la fecha de hace 30 días desde hoy
  const thirtyDaysAgo = subDays(new Date(), 30);

  // Filtra las transacciones que están dentro del rango de los últimos 30 días
  const filteredTransactions = transactions.filter((transaccion) =>
    isAfter(new Date(transaccion.date), thirtyDaysAgo),
  );

  // Configuración para formatear números como moneda peruana
  const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2, // Asegura dos decimales
    maximumFractionDigits: 2,
  });

  return (
    <CardComponent
      title="Transacciones Recientes"
      description="Has realizado estas transacciones durante los últimos 30 días"
      className="shadow-lg"
    >
      <ScrollArea className="h-[385px]">
        <div className="space-y-6">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaccion) => (
              <div
                className="dark:bg-gray-70 flex items-center rounded-lg bg-gray-100 p-3"
                key={transaccion._id} // Utilizamos _id como key ya que es único
              >
                <div
                  className={`rounded-full p-2 ${
                    transaccion.type === "ingreso"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {transaccion.type === "ingreso" ? (
                    <ArrowUpIcon className="h-4 w-4 text-white" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="ml-4 flex-grow space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-800">
                    {transaccion.category}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {/* Formatea la fecha usando date-fns */}
                    {format(new Date(transaccion.date), "dd MMMM yyyy", {
                      locale: es,
                    })}{" "}
                    - {transaccion.description}
                  </p>
                </div>
                <div
                  className={`font-medium ${
                    transaccion.type === "ingreso"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaccion.type === "ingreso" ? "+" : "-"}
                  {currencyFormatter.format(transaccion.amount)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No hay transacciones en los últimos 30 días.
            </p>
          )}
        </div>
      </ScrollArea>
    </CardComponent>
  );
}
