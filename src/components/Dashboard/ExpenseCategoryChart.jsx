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

// Función para generar la configuración del gráfico dinámicamente
const generateChartConfig = (data) => {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
    "hsl(var(--chart-9))",
    "hsl(var(--chart-10))",
    "hsl(var(--chart-11))",
    "hsl(var(--chart-12))",
    "hsl(var(--chart-13))",
    "hsl(var(--chart-14))",
    "hsl(var(--chart-15))",
    "hsl(var(--chart-16))",
    "hsl(var(--chart-17))",
    "hsl(var(--chart-18))",
    "hsl(var(--chart-19))",
    "hsl(var(--chart-20))",
    // Añade más colores si es necesario
  ];

  return data.reduce(
    (config, item, index) => {
      config[item.name] = {
        label: capitalize(item.name),
        color: colors[index % colors.length],
        dataKey: currencyFormatter.format(item.value),
      };

      console.log("🚀 ~ generateChartConfig ~ config:", config);
      return config;
    },

    {
      value: { label: data.value },
      name: { label: data.name },
    },
  );
};

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
  console.log("🚀 ~ ExpenseCategoryChart ~ dataForChart:", dataForChart);

  // Genera la configuración del gráfico
  const chartConfig = generateChartConfig(dataForChart);
  console.log("🚀 ~ ExpenseCategoryChart ~ chartConfig:", chartConfig);

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
              outerRadius={110}
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
