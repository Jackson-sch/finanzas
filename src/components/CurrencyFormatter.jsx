  // Configuración para formatear números como moneda peruana
  export const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2, // Asegura dos decimales
    maximumFractionDigits: 2,
  });