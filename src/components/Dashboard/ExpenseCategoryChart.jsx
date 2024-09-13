import React from "react";
import { CardComponent } from "@/components/CardComponent";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import capitalize from "@/utils/capitalize";
import generateChartConfig from "@/utils/ChartConfig";



// Función para agrupar transacciones por categoría solo de egresos
const groupTransactionsByCategory = (transactions) => {
  const groupedData = {};

  transactions.forEach((transaction) => {
    const { category, amount } = transaction;
    if (groupedData[category]) {
      groupedData[category] += amount;
    } else {
      groupedData[category] = amount;
    }
  });

  return Object.keys(groupedData).map((category) => ({
    name: category,
    value: groupedData[category],
  }));
};

export default function ExpenseCategoryChart({ transactions }) {
  // Filtra solo las transacciones de tipo "egreso"
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "egreso",
  );

  // Transforma las transacciones para que se agrupen por categoría
  const dataForChart = groupTransactionsByCategory(expenseTransactions);

  // Genera la configuración del gráfico
  const chartConfig = generateChartConfig(dataForChart);

  return (
    <CardComponent
      title="Gastos por Categoría"
      description="Distribución de gastos por categoría"
      className="h-full min-w-max shadow-lg"
    >
      {dataForChart.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No hay datos para mostrar
        </p>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={dataForChart}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {dataForChart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry.name].color}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" valueKey="value" />}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" valueKey="value" />}
              className="flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      )}
    </CardComponent>
  );
}
