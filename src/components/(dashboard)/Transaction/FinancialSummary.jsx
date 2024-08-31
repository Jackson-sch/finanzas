import React from "react";
import { CardComponent } from "../Prestamos/CardPayment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const calculatePercentageChange = (current, previos) => {
  if (previos === 0) return current > 0 ? 100 : 0;
  return ((current - previos) / previos) * 100;
};

const PercentageIndicator = ({ value }) => {
  const isPositive = value > 0;
  const arrowIcon = isPositive ? "▲" : "▼";
  const colorClass = isPositive ? "text-green-600" : "text-red-600";

  return (
    <span className={`text-xs ${colorClass} flex items-center gap-1`}>
      {arrowIcon} {Math.abs(value).toFixed(2)}%
    </span>
  );
};

export default function FinancialSummary({
  summary,
  setSummaryPeriod,
  previousSummary,
}) {
  const ingresosChange = calculatePercentageChange(
    summary.ingresos,
    previousSummary.ingresos,
  );
  const egresosChange = calculatePercentageChange(
    summary.egresos,
    previousSummary.egresos,
  );
  const balanceChange = calculatePercentageChange(
    summary.balance,
    previousSummary.balance,
  );

  return (
    <CardComponent
      title="Resumen financiero"
      description="Resumen rápido de los ingresos y egresos"
    >
      <div className="mb-6 flex justify-end">
        <Select onValueChange={(value) => setSummaryPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diario">Diario</SelectItem>
            <SelectItem value="semanal">Semanal</SelectItem>
            <SelectItem value="mensual">Mensual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CardComponent title="Ingresos" description="Ingresos">
          <p className="text-3xl font-bold text-green-600">
            S/ {summary.ingresos.toFixed(2)}
          </p>
          <PercentageIndicator value={ingresosChange} />
        </CardComponent>
        <CardComponent title="Egresos" description="Egresos">
          <p className="text-3xl font-bold text-red-600">
            S/ {summary.egresos.toFixed(2)}
          </p>
          <PercentageIndicator value={egresosChange} />
        </CardComponent>
        <CardComponent title="Balance" description="Balance">
          <p
            className={`text-3xl font-bold ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            S/ {summary.balance.toFixed(2)}
          </p>
          <PercentageIndicator value={balanceChange} />
        </CardComponent>
      </div>
    </CardComponent>
  );
}
