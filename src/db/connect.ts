import mongoose from "mongoose"

export default async function connect(mongoUri: string) {
  try {
    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error(error)
  }
}
