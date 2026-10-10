import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      maxlength: 120,
    },
    icon: {
      type: String,
      default: "🚀",
      maxlength: 8,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: [true, "Type is required."],
      trim: true,
      maxlength: 60, // e.g. "Website", "Android / iOS"
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      maxlength: 500,
    },
    tech: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: "",
      trim: true,
    },
    github: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);