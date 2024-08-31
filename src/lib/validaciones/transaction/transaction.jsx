import { object, string } from "zod";

export const transactionSchema = object({
  type: string({
    required_error: "El tipo de transacción es obligatorio.",
  }),
  amount: string({
    required_error: "El monto de la transacción es obligatorio.",
  }),
  category: string({
    required_error: "La categoría de la transacción es obligatoria.",
  }),
  tags: string()
    .array()
    .nonempty("Las etiquetas de la transacción son obligatorias."),
  description: string({
    required_error: "La descripción de la transacción es obligatoria.",
  }),
  date: string({
    required_error: "La fecha de la transacción es obligatoria.",
  }),
});
