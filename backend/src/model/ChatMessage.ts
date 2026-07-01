import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorAvatarUrl: { type: String, default: null },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["visible", "hidden"],
      default: "visible",
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
