"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accommodation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const accommodationSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    type: {
        type: String,
        enum: ["suite", "common"],
        default: "common",
    },
    status: {
        type: String,
        enum: ["available", "unavailable"],
        default: "available",
    },
    bedDescription: { type: String, default: "", trim: true },
    fixedBeds: { type: Number, default: 0, min: 0 },
    extraMattresses: { type: Number, default: 0, min: 0 },
    extraPlaces: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: "", trim: true },
    guestIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Guest",
        },
    ],
}, {
    timestamps: true,
});
exports.Accommodation = mongoose_1.default.model("Accommodation", accommodationSchema);
//# sourceMappingURL=Accommodation.js.map