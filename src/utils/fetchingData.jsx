// Función para obtener los préstamos
export const fetchLoans = async () => {
  try {
    const response = await fetch("/api/loans");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
};

// función para obtener los pagos
export const fetchPayments = async () => {
  try {
    const response = await fetch("/api/payments");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};
