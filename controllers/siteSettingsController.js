// backend/controllers/siteSettingsController.js
import SiteSettings from "../models/SiteSettings.js";

const DEFAULT_SETTINGS = {
  whatsappNumber: "919800000000",
  whatsappDisplay: "+91 98000 00000",
  email: "you@gmail.com",
  linkedin: "https://linkedin.com/in/yourusername",
  instagram: "https://instagram.com/yourusername",
  github: "https://github.com/yourusername",
  twitter: "",
  youtube: "",
  location: "",
  tagline: "Build • Teach • Ship",
};

// ─────────────────────────────────────────────────────────────
// GET /api/settings  (public)
// Returns the singleton — creates it with defaults if none exists.
// ─────────────────────────────────────────────────────────────
export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/settings  (admin)
// ─────────────────────────────────────────────────────────────
export const updateSettings = async (req, res, next) => {
  try {
    const {
      whatsappNumber,
      whatsappDisplay,
      email,
      linkedin,
      instagram,
      github,
      twitter,
      youtube,
      location,
      tagline,
    } = req.body;

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(DEFAULT_SETTINGS);
    }

    // Only update fields that were sent (undefined = leave untouched).
    const setIfString = (key, value) => {
      if (typeof value === "string") settings[key] = value.trim();
    };

    setIfString("whatsappNumber", whatsappNumber);
    setIfString("whatsappDisplay", whatsappDisplay);
    setIfString("email", email);
    setIfString("linkedin", linkedin);
    setIfString("instagram", instagram);
    setIfString("github", github);
    setIfString("twitter", twitter);
    setIfString("youtube", youtube);
    setIfString("location", location);
    setIfString("tagline", tagline);

    // Normalize email to lowercase
    if (settings.email) settings.email = settings.email.toLowerCase();

    // Strip non-digits from whatsappNumber for wa.me links
    if (settings.whatsappNumber) {
      settings.whatsappNumber = settings.whatsappNumber.replace(/\D/g, "");
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors)[0].message,
      });
    }
    next(error);
  }
};