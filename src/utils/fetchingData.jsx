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

// función para obtener las transacciones
export const fetchTransactions = async () => {
  try {
    const response = await fetch("/api/transactions");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Función para obtener las categorías
export const fetchCategories = async () => {
  try {
    const response = await fetch("/api/categories");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Función para obtener las etiquetas
export const fetchTags = async () => {
  try {
    const response = await fetch("/api/tags");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}