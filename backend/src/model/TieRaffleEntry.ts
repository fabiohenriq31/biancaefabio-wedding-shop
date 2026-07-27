import mongoose from "mongoose";

const tieRaffleEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    createdByAdminId: {
      type: String,
      default: "",
    },
    createdByAdminName: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

tieRaffleEntrySchema.index({ fullName: 1, createdAt: -1 });
tieRaffleEntrySchema.index({ userId: 1, createdAt: -1 });

export const TieRaffleEntry = mongoose.model("TieRaffleEntry", tieRaffleEntrySchema);
