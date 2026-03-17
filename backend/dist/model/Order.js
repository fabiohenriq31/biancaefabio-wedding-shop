"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
}, { _id: false });
const orderSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    giftMessage: { type: String, default: "" },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["awaiting_payment", "paid", "failed", "refunded"],
        default: "awaiting_payment",
    },
    paymentMethod: {
        type: String,
        enum: ["pix", "credit_card", "payment_link", "manual_redirect"],
        default: "payment_link",
    },
}, {
    timestamps: true,
});
exports.Order = mongoose_1.default.model("Order", orderSchema);
//# sourceMappingURL=Order.js.map