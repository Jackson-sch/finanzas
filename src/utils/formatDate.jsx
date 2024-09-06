import { format } from 'date-fns';

// Función para formatear la fecha
export const formatLocalDate = (date) => {
  if (!date) return '';
  return format(date, 'dd/MM/yyyy'); // Formatea la fecha como 'dd/MM/yyyy'
};
