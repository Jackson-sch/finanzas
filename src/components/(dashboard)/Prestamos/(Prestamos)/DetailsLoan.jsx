import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";


export default function DetailsLoan() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del préstamo</CardTitle>
        <CardDescription>
          Vea los detalles y el cronograma de reembolso de su préstamo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Monto del préstamo</Label>
            <p className="text-lg font-medium">$10,000</p>
          </div>
          <div>
            <Label>Tasa de interés</Label>
            <p className="text-lg font-medium">8%</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Plazo de préstamo</Label>
            <p className="text-lg font-medium">24 meses</p>
          </div>
          <div>
            <Label>Fecha de inicio</Label>
            <p className="text-lg font-medium">2023-05-01</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Prestataria</Label>
            <p className="text-lg font-medium">John Doe</p>
          </div>
          <div>
            <Label>Prestadora</Label>
            <p className="text-lg font-medium">Jane Smith</p>
          </div>
        </div>
        <Separator />
        <div>
          <Label>Total por pagar</Label>
          <p className="text-2xl font-bold">$11,200</p>
        </div>
      </CardContent>
    </Card>
  );
}
