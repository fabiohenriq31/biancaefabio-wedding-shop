"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestCleanupSetting = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const guestCleanupSettingSchema = new mongoose_1.default.Schema({
    enabled: { type: Boolean, default: false },
    executeAt: { type: Date, default: null },
    lastExecutedAt: { type: Date, default: null },
    lastDeletedCount: { type: Number, default: 0, min: 0 },
}, {
    timestamps: true,
});
exports.GuestCleanupSetting = mongoose_1.default.model("GuestCleanupSetting", guestCleanupSettingSchema);
//# sourceMappingURL=GuestCleanupSetting.js.map