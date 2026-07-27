"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TieRaffleEntry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tieRaffleEntrySchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
tieRaffleEntrySchema.index({ fullName: 1, createdAt: -1 });
tieRaffleEntrySchema.index({ userId: 1, createdAt: -1 });
exports.TieRaffleEntry = mongoose_1.default.model("TieRaffleEntry", tieRaffleEntrySchema);
//# sourceMappingURL=TieRaffleEntry.js.map