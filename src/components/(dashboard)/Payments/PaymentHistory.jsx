import { CardComponent } from "@/components/CardComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import capitalize from "@/utils/capitalize";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import { formatLocalDate } from "@/utils/formatDate";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { TrashIcon } from "lucide-react";
import { useEffect } from "react";

export default function PaymentHistory({ payments, loans, deletePayment }) {
  const { toast } = useToast();

  useEffect(() => {
    // Verificar si algún pago es el último y mostrar un mensaje
    payments.forEach((payment) => {
      const loan = loans.find((loan) => loan._id === payment.loanId);
      if (loan) {
        const loanData = calculateSimulatorData(loan, payment.paymentNumber);

        if (payment.paymentNumber >= loanData.totalPayments) {
          toast({
            title: "Préstamo pagado",
            description: `El préstamo de ${capitalize(loanData.borrower)} ha sido pagado completamente`,
            status: "success",
            duration: 4000,
          });
        }
      }
    });
  }, [payments, loans, toast]);

  return (
    <CardComponent
      title="Historial de pago"
      description="Ver el historial de los pagos de su préstamo."
      className="shadow-lg"
    >
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Prestatario</TableHead>
              <TableHead>N° de cuota</TableHead>
              <TableHead>Monto Inicial</TableHead>
              <TableHead>Pago mensual</TableHead>
              <TableHead>Restante</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Progreso</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-lg text-muted-foreground"
                >
                  No hay pagos registrados
                </TableCell>
              </TableRow>
            )}
            {payments.map((payment, index) => {
              // Encontrar el préstamo correspondiente a este pago
              const loan = loans.find((loan) => loan._id === payment.loanId);

              // Verificar si el préstamo existe
              if (!loan) return null;

              // Calcular datos del simulador para este préstamo
              const loanData = calculateSimulatorData(
                loan,
                payment.paymentNumber,
              );

              // Calcular el progreso del préstamo
              const progress =
                loanData.totalPayments > 0
                  ? (
                      (payment.paymentNumber / loanData.totalPayments) *
                      100
                    ).toFixed(2)
                  : 100;

              return (
                <TableRow key={index}>
                  <TableCell>{formatLocalDate(loan.date)}</TableCell>
                  <TableCell>{loanData.borrower}</TableCell>
                  <TableCell className="text-center">
                    {payment.paymentNumber}
                  </TableCell>
                  <TableCell>
                    {currencyFormatter.format(loanData.loanAmount)}
                  </TableCell>
                  <TableCell>
                    {currencyFormatter.format(loanData.paymentAmount)}
                  </TableCell>
                  <TableCell>
                    {currencyFormatter.format(loanData.remainingAmount)}
                  </TableCell>
                  <TableCell>
                    {currencyFormatter.format(loanData.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <div className="relative w-full">
                      <Progress value={progress} max={100} />
                      {/* Texto superpuesto */}
                      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                        {/* {progress === 100 ? 'Completado' : ''} */}
                        {progress}%{" "}
                        {/* O puedes poner `S/ {loanData.remainingAmount}` */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePayment(payment._id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardComponent>
  );
}
