import { CardComponent } from "@/components/CardComponent";
import React, { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import capitalize from "@/utils/capitalize";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

// Función para transformar las transacciones en egresos e ingresos por mes
const getMonthlyData = (transactions) => {
  const monthlyData = {
    ingresos: {},
    egresos: {},
  };

  transactions.forEach((transaction) => {
    const { type, amount, date } = transaction;
    const dateObj = parseISO(date);
    const month = format(dateObj, "yyyy-MM");

    if (type === "egreso") {
      if (monthlyData.egresos[month]) {
        monthlyData.egresos[month] += amount;
      } else {
        monthlyData.egresos[month] = amount;
      }
    }
  });

  // Convertir el objeto agrupado en un array adecuado para el gráfico
  const sortedMonths = [...new Set([...Object.keys(monthlyData.egresos)])].sort(
    (a, b) => new Date(a) - new Date(b),
  );

  return sortedMonths.map((month) => ({
    month: format(parseISO(`${month}-01`), "MMMM", { locale: es }),
    egresos: monthlyData.egresos[month] || 0,
  }));
};

export default function SpendingTrendChart({ transactions }) {
  const [highlighted, setHighlighted] = useState(null); // Estado para el color activo

  const data = getMonthlyData(transactions);
  console.log("🚀 ~ SpendingTrendChart ~ data:", data);

  const handleMouseEnter = (name) => {
    setHighlighted(name);
  };

  const handleMouseLeave = () => {
    setHighlighted(null);
  };

  const chartConfig = {
    egresos: {
      label: "Egresos",
      color: "hsl(var(--chart-1))",
      dataKey: "egresos",
    },
  };

  return (
    <CardComponent
      title="Tendencia de Egresos"
      description="Ingresos y egresos por mes"
      className="shadow-lg"
    >
      {/* si no hay datos para el gráfico, muestra un mensaje */}
      {data.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No hay datos para mostrar
        </p>
      ) : (
        <ChartContainer config={chartConfig} width="100%" height={350}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorEgreso" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#d5294d"
                  stopOpacity={highlighted === "Egresos" ? 0.8 : 0.6}
                />
                <stop
                  offset="95%"
                  stopColor="#ea546c"
                  stopOpacity={highlighted === "Egresos" ? 0.8 : 0}
                />
              </linearGradient>
            </defs>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => currencyFormatter.format(value)}
                  labelFormatter={(value) => capitalize(value)}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
            <Area
              type="monotone"
              dataKey={chartConfig.egresos.dataKey}
              stroke="#d5294d"
              fillOpacity={1}
              fill="url(#colorEgreso)"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </CardComponent>
  );
}
