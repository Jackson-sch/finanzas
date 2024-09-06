import { model, models, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio."],
      trim: true,
      unique: true, // Si quieres asegurarte de que no haya nombres duplicados
    },
    email: {
      type: String,
      required: true,
      index: true, // Añadir un índice para mejorar las consultas por email
    },
    isUserAdded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models?.Category || model("Category", CategorySchema);
