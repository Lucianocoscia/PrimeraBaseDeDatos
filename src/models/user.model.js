import { model, Schema } from "mongoose";

// modelo schema de mongodb
const userSchema = Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
});

export const User = model("user", userSchema);
