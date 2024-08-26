import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { formatDate } from "@/utils/formattedDate";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";
import { useEffect } from "react";

export default function PaymentHistory({ payments, loans }) {

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
  }, [payments, loans]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de pago</CardTitle>
        <CardDescription>
          Ver el historial de los pagos de su préstamo.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            </TableRow>
          </TableHeader>
          <TableBody>
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
                  <TableCell>{formatDate(loan.date)}</TableCell>
                  <TableCell>{loanData.borrower}</TableCell>
                  <TableCell className="text-center">
                    {payment.paymentNumber}
                  </TableCell>
                  <TableCell>S/ {loanData.loanAmount}</TableCell>
                  <TableCell>S/ {loanData.paymentAmount}</TableCell>
                  <TableCell>S/ {loanData.remainingAmount}</TableCell>
                  <TableCell>S/ {loanData.totalAmount}</TableCell>
                  <TableCell>
                    <Progress value={progress} max={100}>
                      {progress}%
                    </Progress>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
