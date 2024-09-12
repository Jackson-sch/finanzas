import { CardComponent } from "@/components/CardComponent";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import capitalize from "@/utils/capitalize";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { currencyFormatter } from "@/utils/CurrencyFormatter";

// Función para agrupar transacciones por mes y tipo
const groupTransactionsByMonthAndType = (transactions) => {
  const monthlyData = {};

  transactions.forEach((transaction) => {
    const { amount, type, date } = transaction;
    if (type === "ingreso" || type === "egreso") {
      const month = format(parseISO(date), "yyyy-MM"); // Formatear la fecha para agrupar por mes
      if (!monthlyData[month]) {
        monthlyData[month] = { ingresos: 0, egresos: 0 };
      }
      if (type === "ingreso") {
        monthlyData[month].ingresos += amount;
      } else if (type === "egreso") {
        monthlyData[month].egresos += amount;
      }
    }
  });

  // Convertir el objeto agrupado en un array adecuado para el gráfico
  const sortedData = Object.keys(monthlyData)
    .sort((a, b) => new Date(a) - new Date(b)) // Ordenar cronológicamente
    .map((month) => ({
      name: format(parseISO(`${month}-01`), "MMMM", { locale: es }), // Formatear el nombre del mes
      ingresos: monthlyData[month].ingresos,
      egresos: monthlyData[month].egresos,
    }));

  return sortedData;
};

export default function IncomeAndExpenseChart({ transactions }) {
  // Transforma las transacciones para obtener ingresos y egresos mensuales
  const data = groupTransactionsByMonthAndType(transactions);

  const chartConfig = {
    ingresos: {
      label: "Ingresos",
      color: "hsl(var(--chart-1))",
      dataKey: "ingresos",
      icon: ArrowUpNarrowWide,
    },
    egresos: {
      label: "Egresos",
      color: "hsl(var(--chart-2))",
      dataKey: "egresos",
      icon: ArrowDownNarrowWide,
    },
  };

  return (
    <CardComponent
      title="Ingresos vs Egresos"
      description="Ingresos vs Egresos por meses del último año"
      className="shadow-lg"
    >
      {/* si no hay datos para el gráfico, muestra un mensaje */}
      {data.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No hay datos para mostrar
        </p>
      ) : (
        <ChartContainer config={chartConfig} width="100%" height={415}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#105494" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2086d7" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="gradEgresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F87171" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickFormatter={(value) => capitalize(value.slice(0, 3))}
            />
            <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
            <ChartTooltip 
              content={
                <ChartTooltipContent
                formatter={(value) => currencyFormatter.format(value)}
                labelFormatter={(value) => capitalize(value)}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent  />} />
            
            {/* <Tooltip
              formatter={(value) => currencyFormatter.format(value)}
              labelFormatter={(value) => capitalize(value)}
            /> */}
            <Bar
              dataKey={chartConfig.ingresos.dataKey}
              fill="url(#gradIngresos)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey={chartConfig.egresos.dataKey}
              fill="url(#gradEgresos)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}
    </CardComponent>
  );
}
