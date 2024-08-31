import { object, string } from "zod";

export const categorySchema = object({
  name: string({
    required_error: "El nombre de la categoría es obligatorio.",
  }).min(1, "El nombre de la categoría no puede estar vacío."),
});
