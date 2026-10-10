// backend/models/SiteSettings.js
import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    // WhatsApp — stored as digits only (country code + number, no +, no spaces)
    whatsappNumber: {
      type: String,
      default: "",
      trim: true,
      maxlength: 20,
    },
    // Human-friendly display version, e.g. "+977 9812345678"
    whatsappDisplay: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      maxlength: 200,
    },

    linkedin: { type: String, default: "", trim: true, maxlength: 300 },
    instagram: { type: String, default: "", trim: true, maxlength: 300 },
    github: { type: String, default: "", trim: true, maxlength: 300 },
    twitter: { type: String, default: "", trim: true, maxlength: 300 },
    youtube: { type: String, default: "", trim: true, maxlength: 300 },

    location: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    tagline: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);