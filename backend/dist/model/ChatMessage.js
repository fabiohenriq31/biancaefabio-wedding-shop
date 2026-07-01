"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatMessageSchema = new mongoose_1.default.Schema({
    authorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorAvatarUrl: { type: String, default: null },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ["visible", "hidden"],
        default: "visible",
    },
}, {
    timestamps: true,
});
exports.ChatMessage = mongoose_1.default.model("ChatMessage", chatMessageSchema);
//# sourceMappingURL=ChatMessage.js.map