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
import { payments } from "../data";

export default function PaymentHistory() {
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
              <TableHead>Monto Inicial</TableHead>
              <TableHead>Monto pagado</TableHead>
              <TableHead>Restante</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, index) => (
              <TableRow key={index}>
                <TableCell>{payment.fecha}</TableCell>
                <TableCell>{payment.prestatario}</TableCell>
                <TableCell>${payment.montoInicial}</TableCell>
                <TableCell>${payment.cantidadPago}</TableCell>
                <TableCell>${payment.saldoRestante}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
