import { format } from 'date-fns';

// Función para formatear la fecha
export const formatLocalDate = (date) => {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd'); // Formato ISO sin desfasaje de zona horaria
};
