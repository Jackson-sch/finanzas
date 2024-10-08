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
import NoDataDisplay from "../NoDataDisplay/NoDataDisplay";
import { AreaChartIcon } from "lucide-react";

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

  const data = getMonthlyData(transactions);

  const chartConfig = {
    egresos: {
      label: "Egresos",
      color: "hsl(var(--chart-11))",
    },
  };

  return (
    <CardComponent
      title="Tendencia de Egresos"
      description="Egresos por meses del año"
      className="shadow-lg h-full"
    >
      {/* si no hay datos para el gráfico, muestra un mensaje */}
      {data.length === 0 ? (
        <NoDataDisplay
          icon={AreaChartIcon}
          title="No hay datos de transacciones"
          description="No hay datos de transacciones para mostrar en este gráfico de tendencia de egresos."
        />
      ) : (
        <ChartContainer config={chartConfig} width="100%" height={350}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 14, left: 14, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorEgreso" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-11))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-11))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => capitalize(value)}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickFormatter={(value) => capitalize(value.slice(0, 3))}
            />
            <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
            <Area
              type="natural"
              dataKey="egresos"
              stroke="hsl(var(--chart-11))"
              fillOpacity={0.8}
              fill="url(#colorEgreso)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </CardComponent>
  );
}
