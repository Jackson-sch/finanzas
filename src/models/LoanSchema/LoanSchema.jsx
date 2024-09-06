import { Schema, model, models } from "mongoose";

const LoanSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true, // Añadir un índice para mejorar las consultas por email
    },
    borrower: {
      //Prestatario
      type: String,
      required: true,
    },
    amount: {
      //Monto
      type: Number,
      required: true,
    },
    interestYear: {
      //Tasa de interés anual
      type: Number,
      required: true,
    },
    interestRate: {
      //Tasa de interés mensual
      type: Number,
      required: true,
    },
    durationYears: {
      //Plazo Years
      type: Number,
      required: true,
    },
    durationMonths: {
      //Plazo Months
      type: Number,
      required: true,
    },
    date: {
      //Fecha
      type: Date,
      required: true,
    },
    paymentFrequency: {
      //Frecuencia de pago
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default models?.Loan || model("Loan", LoanSchema);
