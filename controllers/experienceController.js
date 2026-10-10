// backend/controllers/experienceController.js
import mongoose from "mongoose";
import Experience from "../models/Experience.js";

// ─────────────────────────────────────────────────────────────
// GET /api/experience  (public)
// ─────────────────────────────────────────────────────────────
export const getAllExperiences = async (req, res, next) => {
  try {
    const items = await Experience.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/experience/:id  (public)
// ─────────────────────────────────────────────────────────────
export const getExperienceById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid id." });
    }

    const item = await Experience.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, error: "Experience entry not found." });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/experience  (admin)
// ─────────────────────────────────────────────────────────────
export const createExperience = async (req, res, next) => {
  try {
    const { date, role, text, dotColor, order } = req.body;

    if (!date?.trim() || !role?.trim() || !text?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Date, role, and description are required.",
      });
    }

    const item = await Experience.create({
      date: date.trim(),
      role: role.trim(),
      text: text.trim(),
      dotColor: dotColor || "indigo",
      order: Number(order) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Experience entry created.",
      data: item,
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

// ─────────────────────────────────────────────────────────────
// PUT /api/experience/:id  (admin)
// ─────────────────────────────────────────────────────────────
export const updateExperience = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid id." });
    }

    const { date, role, text, dotColor, order } = req.body;

    const updates = {};
    if (typeof date === "string") updates.date = date.trim();
    if (typeof role === "string") updates.role = role.trim();
    if (typeof text === "string") updates.text = text.trim();
    if (typeof dotColor === "string") updates.dotColor = dotColor;
    if (order !== undefined) updates.order = Number(order) || 0;

    const item = await Experience.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, error: "Experience entry not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Experience entry updated.",
      data: item,
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

// ─────────────────────────────────────────────────────────────
// DELETE /api/experience/:id  (admin)
// ─────────────────────────────────────────────────────────────
export const deleteExperience = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid id." });
    }

    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, error: "Experience entry not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Experience entry deleted.",
    });
  } catch (error) {
    next(error);
  }
};