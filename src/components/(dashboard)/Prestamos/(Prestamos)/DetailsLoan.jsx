import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function DetailsLoan({ simulatorData }) {
  console.log("🚀 ~ DetailsLoan ~ simulatorData:", simulatorData);
  if (!simulatorData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay datos disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No hay datos disponibles para mostrar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del préstamo</CardTitle>
        <CardDescription>
          Vea los detalles y el cronograma de reembolso de su préstamo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1">
          <Label>Prestatario</Label>
          <p className="text-lg font-medium capitalize">{simulatorData.borrower}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Monto del préstamo</Label>
            <p className="text-lg font-medium">S/ {simulatorData.loanAmount}</p>
          </div>
          <div>
            <Label>Tasa de interés anual</Label>
            <p className="text-lg font-medium">{simulatorData.interestYear}%</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Plazo de préstamo</Label>
            <p className="text-lg font-medium">
              {simulatorData.durationMonths} meses
            </p>
          </div>
          <div>
            <Label>Frecuencia de pago</Label>
            <p className="text-lg font-medium">
              {simulatorData.paymentFrequency}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tasa de interés efectiva</Label>
            <p className="text-lg font-medium">
              {simulatorData.interestRate}%
            </p>
          </div>
          <div>
            <Label>Monto de pago mensual</Label>
            <p className="text-lg font-medium">S/ {simulatorData.paymentAmount}</p>
          </div>
        </div>
        <Separator />
        <div>
          <Label>Total por pagar</Label>
          <p className="text-2xl font-bold">S/ {simulatorData.totalAmount}</p>
        </div>
      </CardContent>
    </Card>
  );
}
