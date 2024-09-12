/// crea una función que reciba un string y devuelva el mismo string con la primera letra en mayúscula de cada palabra.
export default function capitalize(string) {
  // Verificar si el input es una string válida
  if (typeof string !== 'string' || string.length === 0) {
    return ''; // Retornar una string vacía si el input no es válido
  }

  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}