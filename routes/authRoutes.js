import express from "express";

import {
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/me", authMiddleware, getAdminProfile);

router.post("/logout", authMiddleware, logoutAdmin);

export default router;