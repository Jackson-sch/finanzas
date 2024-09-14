import { CardComponent } from "@/components/CardComponent";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";
import { format, isAfter, subDays } from "date-fns"; // Importa las funciones necesarias de date-fns
import { es } from "date-fns/locale"; // Importa la localización en español
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import NoDataDisplay from "../NoDataDisplay/NoDataDisplay";

export default function LatestTransactions({ transactions }) {
  // Calcula la fecha de hace 30 días desde hoy
  const thirtyDaysAgo = subDays(new Date(), 30);

  // Filtra las transacciones que están dentro del rango de los últimos 30 días
  const filteredTransactions = transactions.filter((transaction) =>
    isAfter(new Date(transaction.date), thirtyDaysAgo),
  );

  return (
    <CardComponent
      title="Transacciones Recientes"
      description="Has realizado estas transacciones durante los últimos 30 días"
      className="shadow-lg"
    >
      <ScrollArea className="h-[385px]">
        <div className="space-y-6">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div
                className="dark:bg-gray-70 flex items-center rounded-lg bg-gray-100 p-3"
                key={transaction._id} // Utilizamos _id como key ya que es único
              >
                <div
                  className={`rounded-full p-2 ${
                    transaction.type === "ingreso"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {transaction.type === "ingreso" ? (
                    <ArrowUpIcon className="h-3 w-3 text-white md:h-4 md:w-4" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 text-white md:h-4 md:w-4" />
                  )}
                </div>
                <div className="ml-4 flex-grow space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-800">
                    {transaction.category}
                  </p>
                  <p className="text-xs capitalize text-gray-600">
                    {/* Formatea la fecha usando date-fns */}
                    {format(new Date(transaction.date), "dd MMMM yyyy", {
                      locale: es,
                    })}{" "}
                    - {transaction.description}
                  </p>
                </div>
                <div
                  className={` ${
                    transaction.type === "ingreso"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  <p className="text-xs font-medium md:pr-2 md:text-base">
                    {transaction.type === "ingreso" ? "+" : "-"}
                    {currencyFormatter.format(transaction.amount)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <NoDataDisplay
              icon={ArrowDownIcon}
              title="No hay datos disponibles"
              description="No hay transacciones para mostrar en este momento."
            />
          )}
        </div>
      </ScrollArea>
    </CardComponent>
  );
}
