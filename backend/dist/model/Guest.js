"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guest = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const guestSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, default: "" },
    companions: { type: String, default: "" },
    message: { type: String, default: "" },
    guestType: {
        type: String,
        enum: ["guest", "groomsman"],
        default: "guest",
    },
    isChild: { type: Boolean, default: false },
    isAttending: { type: Boolean, default: true },
    status: {
        type: String,
        enum: ["confirmed", "not_confirmed"],
        default: "confirmed",
    },
}, {
    timestamps: true,
});
exports.Guest = mongoose_1.default.model("Guest", guestSchema);
//# sourceMappingURL=Guest.js.map