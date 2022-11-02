import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  discriminator: String,
  level: Number,
  verified: Boolean,
  warnings: [],
})

export const userModel = mongoose.model("users", userSchema)
