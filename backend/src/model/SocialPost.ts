import mongoose from "mongoose";

const socialPostSchema = new mongoose.Schema(
  {
    authorName: { type: String, default: "Convidado" },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    authorAvatarUrl: { type: String, default: null },
    message: { type: String, required: true },
    imageUrl: { type: String, default: null },
    thumbnailUrl: { type: String, default: null },
    publicId: { type: String, default: null },
    likeCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    repostCount: { type: Number, default: 0 },
    repostedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, required: true },
        authorAvatarUrl: { type: String, default: null },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
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

export const SocialPost = mongoose.model("SocialPost", socialPostSchema);
