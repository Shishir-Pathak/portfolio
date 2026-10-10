import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      maxlength: 200,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email."],
    },
    message: {
      type: String,
      required: [true, "Message is required."],
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
      index: true,
    },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });

export default mongoose.model("Contact", contactSchema);