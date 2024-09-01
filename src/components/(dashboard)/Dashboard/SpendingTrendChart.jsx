import { CardComponent } from "@/components/CardComponent";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { currencyFormatter } from "@/components/CurrencyFormatter";

// Función para transformar las transacciones en egresos por mes
const getMonthlyEgresos = (transactions) => {
  const monthlyEgresos = {};

  transactions.forEach((transaction) => {
    if (transaction.type === "egreso") {
      const date = parseISO(transaction.date); // Convierte la fecha a un objeto Date
      const month = format(date, "yyyy-MM"); // Formatea la fecha a "yyyy-MM" para agrupar por mes

      if (monthlyEgresos[month]) {
        monthlyEgresos[month] += transaction.amount
      } else {
        monthlyEgresos[month] = transaction.amount
      }
    }
  });

  // Convertir el objeto agrupado en un array adecuado para el gráfico
  const sortedData = Object.keys(monthlyEgresos)
    .sort((a, b) => new Date(a) - new Date(b)) // Ordenar cronológicamente
    .map((month) => ({
      month: format(parseISO(`${month}-01`), "MMMM", { locale: es }), // Formatea el nombre del mes para el eje X
      pv: (monthlyEgresos[month]), // Cambia `egresos` a `pv` para el AreaChart
    }));

  return sortedData;
};

export default function SpendingTrendChart({ transactions }) {
  // Transforma las transacciones para obtener los egresos mensuales
  const data = getMonthlyEgresos(transactions);

  return (
    <CardComponent
      title="Tendencia de Gastos"
      description="Gastos por mes"
      className="bg-white shadow-lg"
    >
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d5294d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ea546c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={currencyFormatter} />
          <Tooltip formatter={(value) => currencyFormatter.format(value)} />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#d5294d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}
