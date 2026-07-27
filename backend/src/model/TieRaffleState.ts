import mongoose from "mongoose";

const tieRaffleStateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["idle", "drawn"],
      default: "idle",
    },
    winnerParticipantKey: {
      type: String,
      default: "",
      trim: true,
    },
    winnerName: {
      type: String,
      default: "",
      trim: true,
    },
    winnerEmail: {
      type: String,
      default: "",
      trim: true,
    },
    winnerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    winnerAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    drawToken: {
      type: String,
      default: "",
      trim: true,
    },
    drawnAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const TieRaffleState = mongoose.model("TieRaffleState", tieRaffleStateSchema);
