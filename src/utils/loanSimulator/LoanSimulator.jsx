// Calcula la tasa de interés equivalente según la frecuencia de pago
export const getEquivalentInterestRate = (interestYear, paymentFrequency) => {
  const annualInterestRate = interestYear / 100;
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
  return Math.ceil((durationMonths / 12) * paymentsPerYear);
};

// Calcula el monto del pago por periodo (cuota mensual, trimestral, semestral o anual)
export const getPaymentAmount = (
  loanAmount,
  equivalentInterestRate,
  totalPayments,
) => {
  if (equivalentInterestRate === 0) {
    return loanAmount / totalPayments;
  }
  return (
    (loanAmount *
      equivalentInterestRate *
      Math.pow(1 + equivalentInterestRate, totalPayments)) /
    (Math.pow(1 + equivalentInterestRate, totalPayments) - 1)
  );
};

// Calcula el monto total a pagar sumando el monto del préstamo y los intereses
export const getTotalAmount = (paymentAmount, totalPayments) => {
  return paymentAmount * totalPayments;
};

// Calcular el monto restante del préstamo después de ciertos pagos
const calculateRemainingAmount = (
  loanAmount,
  paymentAmount,
  paymentNumber,
  totalPayments,
) => {
  const totalPaid = paymentAmount * paymentNumber;

  // Si se ha realizando todos los pagos o más, el monto restante es 0
  if (paymentNumber >= totalPayments) {
    return 0;
  }

  // Calcular el monto restante del préstamo
  const remainingAmount = loanAmount - totalPaid;
  // Si el monto restante es negativo (por redondeo), se devuelve 0
  return remainingAmount > 0 ? remainingAmount.toFixed(2) : 0;
};

// Función principal para calcular los datos del simulador de préstamos
export const calculateSimulatorData = (loanData, paymentNumber = 0) => {
  const loanAmount = parseFloat(loanData.amount);
  const interestRate = parseFloat(loanData.interestRate);
  const interestYear = parseFloat(loanData.interestYear);
  const durationMonths = parseInt(loanData.durationMonths, 10);
  const paymentFrequency = loanData.paymentFrequency;

  // Si la tasa de interés o la duración es 0, las cuotas y el total a pagar serán específicos
  if (interestRate === 0 || durationMonths === 0) {
    return {
      borrower: loanData.borrower,
      interestYear: loanData.interestYear,
      interestRate,
      equivalentInterestRate: 0,
      loanAmount: loanAmount.toFixed(2),
      durationMonths,
      paymentFrequency,
      paymentAmount: 0,
      totalPayments: 0,
      totalAmount: loanAmount.toFixed(2),
      remainingAmount: loanAmount.toFixed(2),
    };
  }

  // Si los datos de entrada no son válidos, lanza un error
  if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(durationMonths)) {
    throw new Error("Datos de entrada no válidos para el cálculo del préstamo");
  }

  // Calcula la tasa de interés equivalente según la frecuencia de pago
  const equivalentInterestRate = getEquivalentInterestRate(
    interestYear,
    paymentFrequency,
  );

  // Calcula el total de pagos en base a la duración en meses y la frecuencia de pago
  const totalPayments = getTotalPayments(durationMonths, paymentFrequency);

  // Calcula el monto del pago por periodo (cuota mensual, trimestral, semestral o anual)
  const paymentAmount = getPaymentAmount(
    loanAmount,
    equivalentInterestRate,
    totalPayments,
  ).toFixed(2);

  // Calcula el monto total a pagar sumando el monto del préstamo y los intereses
  const totalAmount = getTotalAmount(
    parseFloat(paymentAmount),
    totalPayments,
  ).toFixed(2);

  // Calcula el monto restante del préstamo después de ciertos pagos
  const remainingAmount = calculateRemainingAmount(
    loanAmount,
    parseFloat(paymentAmount),
    paymentNumber,
    totalPayments,
  );

  // Retorna los datos calculados del simulador de préstamos
  return {
    borrower: loanData.borrower,
    interestYear: loanData.interestYear,
    interestRate,
    equivalentInterestRate,
    loanAmount: loanAmount.toFixed(2),
    durationMonths,
    paymentFrequency,
    paymentAmount,
    totalPayments,
    totalAmount,
    remainingAmount,
  };
};
