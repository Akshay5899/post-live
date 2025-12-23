import mongoose from "mongoose";

// Prevent recompiling model during hot reload in Next.js
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    photo: { type: String },
  },
  { timestamps: true }
);

// Check if model exists to avoid overwrite issues during hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema);
