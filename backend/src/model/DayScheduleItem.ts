import mongoose from "mongoose";

const dayScheduleItemSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

export const DayScheduleItem = mongoose.model("DayScheduleItem", dayScheduleItemSchema);
