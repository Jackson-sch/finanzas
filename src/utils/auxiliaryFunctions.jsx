// Función para calcular el total de ingresos o egresos de una transacción
export const calculateTotal = (transactions, type) => {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Función para calcular el porcentaje de cambio entre el mes actual y el mes anterior
export const calculatePercentageChange = (currentValue, previousValue) => {
  if (previousValue === 0) return currentValue > 0 ? 100 : 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};
