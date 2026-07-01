import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, default: null, sparse: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, default: null },
    avatarPublicId: { type: String, default: null },
    passwordHash: { type: String, default: null, select: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["google", "local", "both"],
      default: "google",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
