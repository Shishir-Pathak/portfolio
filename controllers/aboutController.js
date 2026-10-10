// backend/controllers/aboutController.js
import About from "../models/About.js";
import cloudinary from "../config/cloudinary.js";

const DEFAULT_DESCRIPTION =
  "I'm a full stack developer who builds scalable web platforms, Android and iOS apps, and teaches learners. I turn ideas into live, deployed products — from Figma design to cloud deployment.";

const DEFAULT_SKILLS = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "React Native",
  "Figma",
  "Tailwind",
];

// ─────────────────────────────────────────────────────────────
// Upload a buffer to Cloudinary.
// Using upload_stream.end(buffer) sends the whole buffer in one
// write — much faster than piping a byte-iterated stream.
// ─────────────────────────────────────────────────────────────
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error("uploadToCloudinary: buffer is required."));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio/about",
        resource_type: "image",
        secure: true,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload failed:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });

// ─────────────────────────────────────────────────────────────
// GET /api/about  (public)
// ─────────────────────────────────────────────────────────────
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        description: DEFAULT_DESCRIPTION,
        skills: DEFAULT_SKILLS,
      });
    }

    return res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    console.error("Get About error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load About information.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/about  (admin)
// ─────────────────────────────────────────────────────────────
export const updateAbout = async (req, res) => {
  let uploadedPhoto = null;

  try {
    const { description } = req.body;
    let skills = req.body.skills;

    // ── Debug logs (remove once stable) ────────────────────
    console.log("📥 updateAbout — req.file:", req.file
      ? `${req.file.originalname} (${req.file.size} bytes)`
      : "undefined");
    console.log("📥 updateAbout — req.body keys:", Object.keys(req.body));

    // Parse skills if it came as a JSON string (FormData)
    if (typeof skills === "string") {
      try {
        skills = JSON.parse(skills);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Skills must be a valid JSON array.",
        });
      }
    }

    // Require at least one field to update
    if (description === undefined && skills === undefined && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Provide a description, skills, or a photo to update.",
      });
    }

    // Validate description
    if (
      description !== undefined &&
      (typeof description !== "string" || !description.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Description cannot be empty.",
      });
    }

    if (description && description.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 3000 characters.",
      });
    }

    // Validate skills
    if (skills !== undefined) {
      if (
        !Array.isArray(skills) ||
        skills.length > 50 ||
        !skills.every(
          (skill) =>
            typeof skill === "string" &&
            skill.trim().length > 0 &&
            skill.trim().length <= 60
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Skills must be an array of up to 50 valid skill names.",
        });
      }

      // Dedupe
      skills = [...new Set(skills.map((skill) => skill.trim()))];
    }

    // Load or create the About document
    let about = await About.findOne();
    if (!about) {
      about = new About({
        description: DEFAULT_DESCRIPTION,
        skills: DEFAULT_SKILLS,
      });
    }

    if (description !== undefined) {
      about.description = description.trim();
    }

    if (skills !== undefined) {
      about.skills = skills;
    }

    const oldPhotoPublicId = about.photoPublicId;

    // ── Handle photo upload ────────────────────────────────
    if (req.file) {
      console.log("📸 Uploading to Cloudinary…");
      const startedAt = Date.now();

      uploadedPhoto = await uploadToCloudinary(req.file.buffer);

      console.log(
        `✅ Cloudinary upload OK in ${Date.now() - startedAt}ms:`,
        uploadedPhoto.secure_url
      );

      about.photoUrl = uploadedPhoto.secure_url;
      about.photoPublicId = uploadedPhoto.public_id;
    } else {
      console.log("ℹ️  No photo in request — skipping Cloudinary upload.");
    }

    await about.save();

    // Delete the old photo only after the new one is saved
    if (
      uploadedPhoto &&
      oldPhotoPublicId &&
      oldPhotoPublicId !== uploadedPhoto.public_id
    ) {
      try {
        await cloudinary.uploader.destroy(oldPhotoPublicId);
        console.log("🗑️  Deleted old Cloudinary photo:", oldPhotoPublicId);
      } catch (deleteError) {
        console.error("Could not delete old photo:", deleteError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "About section updated successfully.",
      about,
    });
  } catch (error) {
    // Cleanup on failure
    if (uploadedPhoto?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedPhoto.public_id);
      } catch (deleteError) {
        console.error("Cloudinary cleanup failed:", deleteError.message);
      }
    }

    console.error("Update About error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update About information.",
    });
  }
};