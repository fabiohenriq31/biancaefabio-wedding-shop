"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    googleId: { type: String, default: null, sparse: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, default: null },
    passwordHash: { type: String, default: null, select: false },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    provider: {
        type: String,
        enum: ["google", "local"],
        default: "google",
    },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map