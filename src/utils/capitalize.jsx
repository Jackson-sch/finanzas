/// crea una función que reciba un string y devuelva el mismo string con la primera letra en mayúscula de cada palabra.
export default function capitalize(string) {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}