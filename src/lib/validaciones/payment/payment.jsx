import { object, string, number, coerce } from "zod";

export const paymentSchema = object({
  loanId: string({
    required_error: "El ID del préstamo es obligatorio.",
  }),
  amount: coerce.number({
    required_error: "El monto del pago es obligatorio.",
  }),
  date: string({
    required_error: "La fecha del pago es obligatoria.",
  }).refine(
    (dateString) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    },
    {
      message: "La fecha del pago debe ser una fecha válida.",
    },
  ),
  paymentNumber: number({
    required_error: "El número de pago es obligatorio.",
  })
    .int()
    .positive()
    .refine((value) => value > 0, {
      message: "El número de pago debe ser mayor a 0.",
    }),
});
