import mongoose from "mongoose";

const financialEntrySchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    note: { type: String, default: "" },
    savedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const FinancialEntry = mongoose.model("FinancialEntry", financialEntrySchema);
