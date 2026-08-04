import mongoose from "mongoose";

const accommodationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["suite", "common"],
      default: "common",
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    bedDescription: { type: String, default: "", trim: true },
    fixedBeds: { type: Number, default: 0, min: 0 },
    extraMattresses: { type: Number, default: 0, min: 0 },
    extraPlaces: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: "", trim: true },
    guestIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Accommodation = mongoose.model("Accommodation", accommodationSchema);
