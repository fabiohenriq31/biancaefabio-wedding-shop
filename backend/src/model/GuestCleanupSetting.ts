import mongoose from "mongoose";

const guestCleanupSettingSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    executeAt: { type: Date, default: null },
    lastExecutedAt: { type: Date, default: null },
    lastDeletedCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

export const GuestCleanupSetting = mongoose.model("GuestCleanupSetting", guestCleanupSettingSchema);
