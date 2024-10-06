import { object, string, number, enum as zEnum } from "zod";

export const loanSchema = object({
  email: string({
    required_error: "El correo electrónico del usuario es obligatorio.",
  }).email("Debe ser un correo electrónico válido."),
  
  borrower: string({
    required_error: "El nombre del prestatario es obligatorio.",
  }).min(1, "El nombre del prestatario no puede estar vacío."),
  
  amount: number().positive("El monto debe ser positivo"),
  
  interestYear: number().min(0, "La tasa de interés no puede ser negativa"),
  
  interestRate: string().min(0, "La tasa de interés no puede ser negativa"),
  
  durationYears: number().min(0, "La duración no puede ser negativa"),
  
  durationMonths: number().min(0, "La duración no puede ser negativa"),
  
  date: string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Fecha inválida",
  }),
  
  paymentFrequency: zEnum(["Mensual", "Trimestral", "Semestral", "Anual"]),
  
  loanType: zEnum(["Personal", "Hipotecario", "Automotriz", "Otro"]),
  
  interestType: zEnum(["Fijo", "Variable"]),
  
  estimatedPayment: number().optional(),
  
  openingCosts: number().min(0, "Los costos no pueden ser negativos").optional(),
  
  insurance: number().min(0, "El costo del seguro no puede ser negativo").optional(),
  
  amortizationMethod: zEnum(["Francés", "Alemán", "Americano"]),
});
