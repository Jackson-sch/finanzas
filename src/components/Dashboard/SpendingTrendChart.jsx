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

    if (type === "ingreso") {
      if (monthlyData.ingresos[month]) {
        monthlyData.ingresos[month] += amount;
      } else {
        monthlyData.ingresos[month] = amount;
      }
    } else if (type === "egreso") {
      if (monthlyData.egresos[month]) {
        monthlyData.egresos[month] += amount;
      } else {
        monthlyData.egresos[month] = amount;
      }
    }
  });

  // Convertir el objeto agrupado en un array adecuado para el gráfico
  const sortedMonths = [
    ...new Set([
      ...Object.keys(monthlyData.ingresos),
      ...Object.keys(monthlyData.egresos),
    ]),
  ].sort((a, b) => new Date(a) - new Date(b));

  return sortedMonths.map((month) => ({
    month: format(parseISO(`${month}-01`), "MMMM", { locale: es }),
    ingresos: monthlyData.ingresos[month] || 0,
    egresos: monthlyData.egresos[month] || 0,
  }));
};

export default function SpendingTrendChart({ transactions }) {
  const [highlighted, setHighlighted] = useState(null); // Estado para el color activo

  const data = getMonthlyData(transactions);

  const handleMouseEnter = (name) => {
    setHighlighted(name);
  };

  const handleMouseLeave = () => {
    setHighlighted(null);
  };

  return (
    <CardComponent
      title="Tendencia de Ingresos y Egresos"
      description="Ingresos y egresos por mes"
      className="bg-white shadow-lg h-full"
    >
      {/* si no hay datos para el gráfico, muestra un mensaje */}
      {data.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No hay datos para mostrar
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIngreso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4caf50" stopOpacity={highlighted === "Ingresos" ? 0.8 : 0.6} />
              <stop offset="95%" stopColor="#81c784" stopOpacity={highlighted === "Ingresos" ? 0.8 : 0} />
            </linearGradient>
            <linearGradient id="colorEgreso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d5294d" stopOpacity={highlighted === "Egresos" ? 0.8 : 0.6} />
              <stop offset="95%" stopColor="#ea546c" stopOpacity={highlighted === "Egresos" ? 0.8 : 0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={currencyFormatter} />
          <Legend
            align="center"
            onMouseEnter={(e) => handleMouseEnter(e.value)}
            onMouseLeave={handleMouseLeave}
          />
          <Tooltip 
            formatter={(value) => currencyFormatter.format(value)} 
            labelFormatter={(value) => capitalize(value)} 
          />
          <Area
            type="monotone"
            dataKey="ingresos"
            stroke="#4caf50"
            fillOpacity={1}
            fill="url(#colorIngreso)"
            name="Ingresos"
          />
          <Area
            type="monotone"
            dataKey="egresos"
            stroke="#d5294d"
            fillOpacity={1}
            fill="url(#colorEgreso)"
            name="Egresos"
          />
        </AreaChart>
      </ResponsiveContainer>
      )}
      
    </CardComponent>
  );
}
