import {object, string} from 'zod'

export const loanSchema = object({
    borrower: string({
    required_error: "El nombre del prestatario es obligatorio.",
  }),
  amount: string({
    required_error: "El monto del préstamo es obligatorio.",
  }),
  interestRate: string({
    required_error: "El interés del préstamo es obligatorio.",
  }),
  duration: string({
    required_error: "La duración del préstamo es obligatoria.",
  }),
  date: string({
    required_error: "La fecha del préstamo es obligatoria.",
  }),
})