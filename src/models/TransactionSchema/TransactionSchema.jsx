import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true, // Añadir un índice para mejorar las consultas por email
    },
    type: {
      type: String,
      enum: ["ingreso", "egreso"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default models?.Transaction || model("Transaction", TransactionSchema);
