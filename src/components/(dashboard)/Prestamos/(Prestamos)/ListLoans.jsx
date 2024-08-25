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
import capitalize from "@/utils/capitalize";
import { formatDate } from "@/utils/formattedDate";
import { calculateSimulatorData } from "@/utils/loanSimulator/LoanSimulator";

export default function ListLoans({ loans }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de préstamos</CardTitle>
        <CardDescription>
          Ver la lista de préstamos registrados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Prestatario</TableHead>
              <TableHead>Monto Inicial</TableHead>
              <TableHead>Pago mensual</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan, index) => {
              const loanData = calculateSimulatorData(loan);
              return (
                <TableRow key={index}>
                  <TableCell>{formatDate(loan.date)}</TableCell>
                  <TableCell>{capitalize(loanData.borrower)}</TableCell>
                  <TableCell>S/ {loanData.loanAmount}</TableCell>
                  <TableCell>S/ {loanData.paymentAmount}</TableCell>
                  <TableCell className="font-bold">S/ {loanData.totalAmount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
