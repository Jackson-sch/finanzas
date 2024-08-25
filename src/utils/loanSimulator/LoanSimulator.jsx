// Calcula la tasa de interés equivalente según la frecuencia de pago
export const getEquivalentInterestRate = (interestRate, paymentFrequency) => {
  const annualInterestRate = interestRate / 100;
  switch (paymentFrequency) {
    case "Mensual":
      return annualInterestRate / 12;
    case "Trimestral":
      return annualInterestRate / 4;
    case "Semestral":
      return annualInterestRate / 2;
    case "Anual":
      return annualInterestRate;
    default:
      throw new Error("Frecuencia de pago no válida");
  }
};

// Retorna la cantidad de pagos por año según la frecuencia de pago
export const getPaymentsPerYear = (paymentFrequency) => {
  switch (paymentFrequency) {
    case "Mensual":
      return 12;
    case "Trimestral":
      return 4;
    case "Semestral":
      return 2;
    case "Anual":
      return 1;
    default:
      throw new Error("Frecuencia de pago no válida");
  }
};

// Calcula el total de pagos en base a la duración en meses y la frecuencia de pago
export const getTotalPayments = (durationMonths, paymentFrequency) => {
  const paymentsPerYear = getPaymentsPerYear(paymentFrequency);
  return durationMonths / (12 / paymentsPerYear);
};

// Calcula el monto del pago por periodo (cuota mensual)
export const getPaymentAmount = (loanAmount, interestRate, totalPayments) => {
  const monthlyInterestRate = interestRate / 100;
  return (
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -totalPayments))
  );
};

// Calcula el monto total a pagar sumando el monto del préstamo y los intereses
export const getTotalAmount = (loanAmount, paymentAmount, totalPayments) => {
  return paymentAmount * totalPayments;
};

// Calcular el monto restante del préstamo después de ciertos pagos
const calculateRemainingAmount = (loanAmount, paymentAmount, paymentNumber) => {
  const totalPaid = paymentAmount * paymentNumber;
  return loanAmount - totalPaid;
};

// Función principal para calcular los datos del simulador de préstamos
export const calculateSimulatorData = (loanData, paymentNumber = 0) => {
  const loanAmount = parseFloat(loanData.amount);
  const interestRate = parseFloat(loanData.interestRate);
  const durationMonths = parseInt(loanData.durationMonths, 10);
  const paymentFrequency = loanData.paymentFrequency;

  if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(durationMonths)) {
    throw new Error("Datos de entrada no válidos para el cálculo del préstamo");
  }

  const equivalentInterestRate = getEquivalentInterestRate(
    interestRate,
    paymentFrequency,
  );

  const totalPayments = getTotalPayments(durationMonths, paymentFrequency);

  const paymentAmount = getPaymentAmount(
    loanAmount,
    interestRate,
    totalPayments,
  ).toFixed(2);

  const totalAmount = getTotalAmount(
    loanAmount,
    paymentAmount,
    totalPayments,
  ).toFixed(2);

  //Calcula el monto restante del préstamo después de ciertos pagos
  const remainingAmount = calculateRemainingAmount(
    loanAmount,
    paymentAmount,
    paymentNumber,
  ).toFixed(2);

  return {
    borrower: loanData.borrower,
    interestYear: loanData.interestYear,
    interestRate,
    equivalentInterestRate,
    loanAmount,
    durationMonths,
    paymentFrequency,
    paymentAmount,
    totalPayments,
    totalAmount,
    remainingAmount,
  };
};
