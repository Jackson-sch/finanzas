import { model, models, Schema } from "mongoose";

const TagsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la etiqueta es obligatorio."],
      trim: true,
      unique: true, // Si quieres asegurarte de que no haya nombres duplicados
    },
  },
  {
    timestamps: true,
  }
);

export default models?.Tags || model("Tags", TagsSchema)