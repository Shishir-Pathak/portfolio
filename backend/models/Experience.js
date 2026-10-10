// backend/models/Experience.js
import mongoose from "mongoose";

const DOT_COLORS = ["cyan", "indigo", "pink", "violet", "amber", "green", "red"];

const experienceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Date range is required."],
      trim: true,
      maxlength: 60, // e.g. "2024 — Present"
    },
    role: {
      type: String,
      required: [true, "Role is required."],
      trim: true,
      maxlength: 120,
    },
    text: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      maxlength: 400,
    },
    dotColor: {
      type: String,
      enum: DOT_COLORS,
      default: "indigo",
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

experienceSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model("Experience", experienceSchema);