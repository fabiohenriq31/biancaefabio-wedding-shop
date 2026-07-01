"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const socialPostSchema = new mongoose_1.default.Schema({
    authorName: { type: String, default: "Convidado" },
    authorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: null },
    authorAvatarUrl: { type: String, default: null },
    message: { type: String, required: true },
    imageUrl: { type: String, default: null },
    thumbnailUrl: { type: String, default: null },
    publicId: { type: String, default: null },
    likeCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
    status: {
        type: String,
        enum: ["approved", "hidden"],
        default: "approved",
    },
}, {
    timestamps: true,
});
exports.SocialPost = mongoose_1.default.model("SocialPost", socialPostSchema);
//# sourceMappingURL=SocialPost.js.map