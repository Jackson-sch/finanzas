import { CardComponent } from "@/components/CardComponent";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import { format, addMonths, isBefore } from "date-fns";
import NoDataDisplay from "../NoDataDisplay/NoDataDisplay";
import { DollarSign, HandCoins } from "lucide-react";

export default function CurrentLoans({ loans }) {
  // traemos los ultimos 5 prestamos
  loans = loans.slice(-5).reverse();
  return (
    <CardComponent
      title="Préstamos Actuales"
      description="Información sobre los préstamos actuales"
      className="h-full shadow-lg"
    >
      <div className="space-y-6">
        {loans.length === 0 && (
          <NoDataDisplay
            icon={HandCoins}
            title="No hay datos disponibles"
            description="No hay prestatarios para mostrar en este momento."
          />
        )}
        {loans.map((loan) => {
          const startDate = new Date(loan.date);
          const dueDate = addMonths(startDate, loan.durationMonths);
          const isOnTime = isBefore(new Date(), dueDate);

          return (
            <div className="flex items-center rounded-lg" key={loan._id}>
              <div className="ml-4 flex-grow space-y-1">
                <p className="text-sm font-medium capitalize leading-none text-gray-800">
                  {loan.borrower}
                </p>
                <p className="text-xs text-gray-600 md:text-sm">
                  Vence:{" "}
                  {loan.date
                    ? format(dueDate, "dd/MM/yyyy")
                    : "Fecha no disponible"}
                </p>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-800">
                  {currencyFormatter.format(loan.amount)}
                </div>
                <div
                  className={`text-xs ${
                    isOnTime ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isOnTime ? "Al día" : "Vencido"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </CardComponent>
  );
}
