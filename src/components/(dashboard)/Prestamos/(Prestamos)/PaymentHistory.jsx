import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatDate } from "@/utils/formattedDate";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";

export default function PaymentHistory({ payments, loans }) {
  console.log("🚀 ~ PaymentHistory ~ loans:", loans);
  console.log("🚀 ~ PaymentHistory ~ payments:", payments);



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
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, index) => {
              // Encontrar el préstamo correspondiente a este pago
              const loan = loans.find((loan) => loan._id === payment.loanId);

              // Calcular datos del simulador para este préstamo
              const loanData = calculateSimulatorData(loan, payment.paymentNumber);
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
