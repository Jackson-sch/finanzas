import capitalize from "./capitalize";
import { currencyFormatter } from "./CurrencyFormatter";

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
      return config;
    },

    {
      value: { label: data.value },
      name: { label: data.name },
    },
  );
};

export default generateChartConfig;