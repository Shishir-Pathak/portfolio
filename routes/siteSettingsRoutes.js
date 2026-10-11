// backend/routes/siteSettingsRoutes.js
import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/siteSettingsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public ─────────────────────────────────────────────────
router.get("/", getSettings);

// ── Admin only ─────────────────────────────────────────────
router.put("/", authMiddleware, updateSettings);

export default router;