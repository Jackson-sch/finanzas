import { boolean, object, string } from "zod";

export const tagSchema = object({
  name: string({
    required_error: "El nombre de la etiqueta es obligatorio.",
  }).min(1, "El nombre de la etiqueta no puede estar vacío."),
  email: string({
    required_error: "El correo electrónico del usuario es obligatorio.",
  }).email("Debe ser un correo electrónico válido."),
  isUserAdded: boolean(),
});
