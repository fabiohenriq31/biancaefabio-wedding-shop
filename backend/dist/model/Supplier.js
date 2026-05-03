"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supplier = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const supplierPaymentSchema = new mongoose_1.default.Schema({
    amount: { type: Number, required: true, min: 0 },
    paidAt: { type: Date, default: Date.now },
    note: { type: String, default: "" },
}, { _id: true });
const supplierSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    category: { type: String, default: "" },
    contact: { type: String, default: "" },
    notes: { type: String, default: "" },
    totalCost: { type: Number, required: true, min: 0 },
    payments: { type: [supplierPaymentSchema], default: [] },
}, {
    timestamps: true,
});
exports.Supplier = mongoose_1.default.model("Supplier", supplierSchema);
//# sourceMappingURL=Supplier.js.map