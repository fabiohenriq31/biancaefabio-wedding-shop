"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TieRaffleState = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tieRaffleStateSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.TieRaffleState = mongoose_1.default.model("TieRaffleState", tieRaffleStateSchema);
//# sourceMappingURL=TieRaffleState.js.map