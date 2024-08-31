import React, { useState } from "react";
import { CardComponent } from "../../CardComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react"; // Import CalendarIcon for better UI

const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
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
  fetchDataForPeriod
}) {
  const [localPeriod, setLocalPeriod] = useState("mensual");

  const handleChange = (value) => {
    setLocalPeriod(value);
    setSummaryPeriod(value); // Actualizar el período en el componente padre
    fetchDataForPeriod(value); // Llamar a la función para actualizar datos
  };

  const ingresosChange = calculatePercentageChange(
    summary.ingresos,
    previousSummary.ingresos
  );
  const egresosChange = calculatePercentageChange(
    summary.egresos,
    previousSummary.egresos
  );
  const balanceChange = calculatePercentageChange(
    summary.balance,
    previousSummary.balance
  );

  return (
    <CardComponent
      title="Resumen financiero"
      description="Resumen rápido de los ingresos y egresos"
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Período actual</h2>
        <Select onValueChange={(value) => handleChange(value)}>
          <SelectTrigger className="w-[180px]">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diario">Diario</SelectItem>
            <SelectItem value="semanal">Semanal</SelectItem>
            <SelectItem value="mensual">Mensual</SelectItem>
            <SelectItem value="anual">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          title="Ingresos"
          amount={summary.ingresos}
          change={ingresosChange}
          color="green"
        />
        <SummaryCard
          title="Egresos"
          amount={summary.egresos}
          change={egresosChange}
          color="red"
        />
        <SummaryCard
          title="Balance"
          amount={summary.balance}
          change={balanceChange}
          color={summary.balance >= 0 ? "green" : "red"}
        />
      </div>
    </CardComponent>
  );
}

const SummaryCard = ({ title, amount, change, color }) => (
  <CardComponent title={title} description={title}>
    <p className={`text-3xl font-bold text-${color}-600`}>
      S/ {amount.toFixed(2)}
    </p>
    <PercentageIndicator value={change} />
  </CardComponent>
);