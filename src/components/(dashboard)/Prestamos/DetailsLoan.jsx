import { CardComponent } from "@/components/CardComponent";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  Calendar,
  Percent,
  DollarSign,
  User,
  Clock,
} from "lucide-react";
import { currencyFormatter } from "@/utils/CurrencyFormatter";

export default function DetailsLoan({ simulatorData }) {
  if (!simulatorData) {
    return (
      <CardComponent
        title="Detalles del prestatario"
        description="Vea los detalles y el cronograma de su préstamo."
        className="shadow-lg"
      >
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No hay datos disponibles para mostrar.
            </p>
          </CardContent>
        </Card>
      </CardComponent>
    );
  }

  const DetailItem = ({ icon: Icon, label, value, className = "" }) => (
    <div className="flex items-center space-x-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <Label className="text-sm text-muted-foreground">{label}</Label>
        <p className={`text-lg font-medium ${className}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <CardComponent
      title="Detalles del prestatario"
      description="Vea los detalles y el cronograma de reembolso de su préstamo."
      className="shadow-lg"
    >
      <div className="space-y-6">
        <DetailItem
          icon={User}
          label="Prestatario"
          value={simulatorData.borrower}
          className="capitalize"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailItem
            icon={CreditCard}
            label="Monto del préstamo"
            value={`${currencyFormatter.format(simulatorData.loanAmount)}`}
          />
          <DetailItem
            icon={Percent}
            label="Tasa de interés anual"
            value={`${simulatorData.interestYear}%`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailItem
            icon={Calendar}
            label="Plazo de préstamo"
            value={`${simulatorData.durationMonths} meses`}
          />
          <DetailItem
            icon={Clock}
            label="Frecuencia de pago"
            value={simulatorData.paymentFrequency}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailItem
            icon={Percent}
            label="Tasa de interés efectiva"
            value={`${simulatorData.interestRate}%`}
          />
          <DetailItem
            icon={DollarSign}
            label="Monto de pago mensual"
            value={`${currencyFormatter.format(simulatorData.paymentAmount)}`}
          />
        </div>

        <DetailItem
          icon={Calendar}
          label="N° de cuotas"
          value={simulatorData.totalPayments}
        />

        <Separator className="my-4" />

        <div className="rounded-lg bg-primary/5 p-4">
          <Label className="text-lg text-primary">Total por pagar</Label>
          <p className="text-3xl font-bold text-primary">
            {currencyFormatter.format(simulatorData.totalAmount)}
          </p>
        </div>
      </div>
    </CardComponent>
  );
}
