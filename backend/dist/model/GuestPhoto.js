"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestPhoto = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const guestPhotoSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.GuestPhoto = mongoose_1.default.model("GuestPhoto", guestPhotoSchema);
//# sourceMappingURL=GuestPhoto.js.map