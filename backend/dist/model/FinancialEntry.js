"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialEntry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const financialEntrySchema = new mongoose_1.default.Schema({
    amount: { type: Number, required: true, min: 0 },
    note: { type: String, default: "" },
    savedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.FinancialEntry = mongoose_1.default.model("FinancialEntry", financialEntrySchema);
//# sourceMappingURL=FinancialEntry.js.map