import { Schema, model, models } from "mongoose";

// Definir el esquema de Payments
const PaymentSchema = new Schema({
  loanId: {
    // Referencia al préstamo asociado
    type: Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
  amount: {
    // Monto del pago
    type: Number,
    required: true,
  },
  date: {
    // Fecha del pago
    type: Date,
    required: true,
  },
  paymentNumber: {
    // Número de pago (para identificar cuántos pagos se han hecho)
    type: Number,
    required: true,
  },
});

export default models?.Payment || model("Payment", PaymentSchema);
