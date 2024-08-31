import { model, models, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio."],
      trim: true,
      unique: true, // Si quieres asegurarte de que no haya nombres duplicados
    },
  },
  {
    timestamps: true,
  }
);

export default models?.Category || model("Category", CategorySchema);
