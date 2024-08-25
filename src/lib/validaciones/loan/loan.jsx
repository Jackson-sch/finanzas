import { object, string, number, date, coerce } from "zod";

export const loanSchema = object({
  borrower: string({
    required_error: "El nombre del prestatario es obligatorio.",
  }),
  amount: string({
    required_error: "El monto del préstamo es obligatorio.",
  }),
  interestYear: string({
    required_error: "La tasa de interés anual del préstamo es obligatoria.",
  }),
  interestRate: string({
    required_error: "El interés del préstamo es obligatorio.",
  }),
  durationYears: string({
    required_error: "La duración del préstamo es obligatoria.",
  }),
  durationMonths: number({
    required_error: "La duración del préstamo es obligatoria.",
  }).int(),
  date: string({
    required_error: "La fecha del préstamo es obligatoria.",
  }),
  paymentFrequency: string({
    required_error: "La frecuencia de pago del préstamo es obligatoria.",
  }),
});

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
