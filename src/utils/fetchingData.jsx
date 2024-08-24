export const fetchLoans = async () => {
  try {
    const response = await fetch("/api/loan");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
};
