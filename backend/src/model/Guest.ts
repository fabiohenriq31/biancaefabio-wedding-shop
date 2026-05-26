import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    companions: { type: String, default: "" },
    message: { type: String, default: "" },
    guestType: {
      type: String,
      enum: ["guest", "groomsman"],
      default: "guest",
    },
    isChild: { type: Boolean, default: false },
    isAttending: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["confirmed", "not_confirmed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

export const Guest = mongoose.model("Guest", guestSchema);
