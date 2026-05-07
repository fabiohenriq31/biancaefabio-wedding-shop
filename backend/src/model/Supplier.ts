import mongoose from "mongoose";

const supplierPaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    paidAt: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { _id: true }
);

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "" },
    contact: { type: String, default: "" },
    notes: { type: String, default: "" },
    staffCount: { type: Number, default: 0, min: 0 },
    totalCost: { type: Number, required: true, min: 0 },
    payments: { type: [supplierPaymentSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Supplier = mongoose.model("Supplier", supplierSchema);
