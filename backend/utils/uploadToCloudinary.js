// backend/utils/uploadToCloudinary.js
import cloudinary from "../config/cloudinary.js";

/**
 * Upload a Buffer to Cloudinary.
 *
 * @param {Buffer} buffer                 — from multer memoryStorage
 * @param {object} options                — Cloudinary upload options
 * @param {string} [options.folder]       — Cloudinary folder
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
const uploadToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error("uploadToCloudinary: buffer is required."));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio/uploads",
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });

export default uploadToCloudinary;