import mongoose from "mongoose";

const guestPhotoSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    guestName: { type: String, default: "Convidado" },
    isApproved: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["approved", "hidden"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

export const GuestPhoto = mongoose.model("GuestPhoto", guestPhotoSchema);
