import { CardComponent } from "@/components/CardComponent";
import { format, addMonths, isBefore } from "date-fns";

export default function CurrentLoans({ loans }) {

  // traemos los ultimos 5 prestamos
  loans = loans.slice(-5).reverse();
  return (
    <>
      <CardComponent
        title="Préstamos Actuales"
        description="Información sobre los préstamos actuales"
      >
        <div className="space-y-6">
          {loans.map((loan) => {
            const startDate = new Date(loan.date);
            const dueDate = addMonths(startDate, loan.durationMonths);
            const isOnTime = isBefore(new Date(), dueDate);

            return (
              <div
                className="flex items-center rounded-lg bg-gray-100 p-3"
                key={loan._id}
              >
                <div className="ml-4 flex-grow space-y-1">
                  <p className="text-sm font-medium capitalize leading-none text-gray-800">
                    {loan.borrower}
                  </p>
                  <p className="text-sm text-gray-600">
                    Vence:{" "}
                    {loan.date
                      ? format(dueDate, "dd/MM/yyyy")
                      : "Fecha no disponible"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-800">
                    S/ {loan.amount}
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
    </>
  );
}
