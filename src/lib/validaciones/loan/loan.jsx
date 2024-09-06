import { object, string, coerce } from "zod";

export const loanSchema = object({
  email: string({
    required_error: "El correo electrónico del usuario es obligatorio.",
  }).email("Debe ser un correo electrónico válido."),
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
  durationMonths: coerce.number({
    required_error: "La duración del préstamo es obligatoria.",
  }).int(),
  date: string({
    required_error: "La fecha del préstamo es obligatoria.",
  }),
  paymentFrequency: string({
    required_error: "La frecuencia de pago del préstamo es obligatoria.",
  }),
});

