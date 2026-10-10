// backend/routes/experienceRoutes.js
import express from "express";
import {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public ─────────────────────────────────────────────────
router.get("/", getAllExperiences);
router.get("/:id", getExperienceById);

// ── Admin only ─────────────────────────────────────────────
router.post("/", authMiddleware, createExperience);
router.put("/:id", authMiddleware, updateExperience);
router.delete("/:id", authMiddleware, deleteExperience);

export default router;