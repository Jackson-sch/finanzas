import { CardComponent } from "@/components/CardComponent";
import { currencyFormatter } from "@/utils/CurrencyFormatter"; 
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Función para agrupar transacciones por categoría solo de egresos
const groupTransactionsByCategory = (transactions) => {
  const groupedData = {};

  transactions.forEach((transaction) => {
    const { category, amount } = transaction;
    // Si la categoría ya existe en groupedData, suma el amount, si no, inicializar
    if (groupedData[category]) {
      groupedData[category] += amount;
    } else {
      groupedData[category] = amount;
    }
  });

  // Convertir el objeto agrupado en un array adecuado para el gráfico
  return Object.keys(groupedData).map((category) => ({
    name: category,
    value: groupedData[category],
  }));
};

export default function ExpenseCategoryChart({ transactions, COLORS }) {
  // Filtra solo las transacciones de tipo "egreso"
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "egreso"
  );

  // Transforma las transacciones para que se agrupen por categoría
  const dataForChart = groupTransactionsByCategory(expenseTransactions);

  return (
    <CardComponent
      title="Gastos por Categoría"
      description="Distribución de gastos por categoría"
      className="shadow-lg h-full"
    >
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <defs>
            {dataForChart.map((entry, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`color-${index}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS[(index + 1) % COLORS.length]} stopOpacity={0.5} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={dataForChart}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {dataForChart.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#color-${index})`}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => currencyFormatter.format(value)} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        {dataForChart.map((category, index) => (
          <div key={index} className="flex items-center">
            <div
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </CardComponent>
  );
}
