"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayScheduleItem = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dayScheduleItemSchema = new mongoose_1.default.Schema({
    dayKey: {
        type: String,
        enum: ["friday", "saturday", "sunday"],
        required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, default: "" },
    title: { type: String, required: true },
    location: { type: String, default: "" },
    notes: { type: String, default: "" },
}, {
    timestamps: true,
});
exports.DayScheduleItem = mongoose_1.default.model("DayScheduleItem", dayScheduleItemSchema);
//# sourceMappingURL=DayScheduleItem.js.map