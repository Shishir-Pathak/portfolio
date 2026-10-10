import express from "express";
import { getAbout, updateAbout } from "../controllers/aboutController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public read
router.get("/", getAbout);

// Admin-only update
router.put("/", authMiddleware, upload.single("photo"), updateAbout);

export default router;