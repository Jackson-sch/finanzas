import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  image: {
    type: String,
  },
  // TODO: Add auth provider, Google, Github, Facebook, etc...
  authProviderId: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default models?.User || model("User", userSchema);
