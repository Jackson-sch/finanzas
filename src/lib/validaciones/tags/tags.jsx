import { object, string } from "zod";

export const tagSchema = object({
  name: string({
    required_error: "El nombre de la etiqueta es obligatorio.",
  }).min(1, "El nombre de la etiqueta no puede estar vacío."),
});
