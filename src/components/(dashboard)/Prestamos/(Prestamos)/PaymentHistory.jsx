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
              <TableHead>Monto pagado</TableHead>
              <TableHead>Restante</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2023-06-01</TableCell>
              <TableCell>$500</TableCell>
              <TableCell>$9,700</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2023-07-01</TableCell>
              <TableCell>$500</TableCell>
              <TableCell>$9,200</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2023-08-01</TableCell>
              <TableCell>$500</TableCell>
              <TableCell>$8,700</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
