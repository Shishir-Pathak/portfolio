import mongoose from "mongoose";
import Product from "../models/Product.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const parseTech = (raw) => {
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    // Accepts JSON array or comma-separated string
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((t) => String(t).trim()).filter(Boolean);
      }
    } catch {
      // fall through
    }
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

// ─────────────────────────────────────────────────────────────
// GET /api/products  (public)
// ─────────────────────────────────────────────────────────────
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/products/:id  (public)
// ─────────────────────────────────────────────────────────────
export const getProductById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid id." });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found." });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/products  (admin)
// ─────────────────────────────────────────────────────────────
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      icon,
      type,
      description,
      tech,
      liveUrl,
      github,
      order,
      featured,
    } = req.body;

    if (!title?.trim() || !type?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Title, type, and description are required.",
      });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, {
        folder: "portfolio/products",
      });
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    const product = await Product.create({
      title: title.trim(),
      icon: icon?.trim() || "🚀",
      type: type.trim(),
      description: description.trim(),
      tech: parseTech(tech),
      liveUrl: liveUrl?.trim() || "",
      github: github?.trim() || "",
      order: Number(order) || 0,
      featured: featured === "true" || featured === true,
      imageUrl,
      imagePublicId,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.error("❌ createProduct error:", error);
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/products/:id  (admin)
// ─────────────────────────────────────────────────────────────
export const updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid id." });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found." });
    }

    const {
      title,
      icon,
      type,
      description,
      tech,
      liveUrl,
      github,
      order,
      featured,
      removeImage, // "true" when admin wants to drop the current image
    } = req.body;

    // Handle image replacement
    if (req.file) {
      // Delete the old one first (best effort)
      if (product.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(product.imagePublicId);
        } catch (err) {
          console.warn("⚠️ Could not delete old product image:", err.message);
        }
      }

      const uploaded = await uploadToCloudinary(req.file.buffer, {
        folder: "portfolio/products",
      });
      product.imageUrl = uploaded.secure_url;
      product.imagePublicId = uploaded.public_id;
    } else if (removeImage === "true" || removeImage === true) {
      if (product.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(product.imagePublicId);
        } catch (err) {
          console.warn("⚠️ Could not delete product image:", err.message);
        }
      }
      product.imageUrl = "";
      product.imagePublicId = "";
    }

    if (typeof title === "string") product.title = title.trim();
    if (typeof icon === "string") product.icon = icon.trim() || "🚀";
    if (typeof type === "string") product.type = type.trim();
    if (typeof description === "string") product.description = description.trim();
    if (tech !== undefined) product.tech = parseTech(tech);
    if (typeof liveUrl === "string") product.liveUrl = liveUrl.trim();
    if (typeof github === "string") product.github = github.trim();
    if (order !== undefined) product.order = Number(order) || 0;
    if (featured !== undefined) {
      product.featured = featured === "true" || featured === true;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    console.error("❌ updateProduct error:", error);
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/products/:id  (admin)
// ─────────────────────────────────────────────────────────────
export const deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid id." });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found." });
    }

    // Clean up the Cloudinary asset (best effort)
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (err) {
        console.warn("⚠️ Could not delete product image:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};