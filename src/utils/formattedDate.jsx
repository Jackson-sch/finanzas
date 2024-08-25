// función para convertir la fecha a un formato legible para el usuario (dd/mm/yyyy)
export const formatDate = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString();
};
