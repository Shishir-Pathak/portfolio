import express from "express";
import {
  createContact,
  getAllContacts,
  getUnreadCount,
  getContactById,
  markAsRead,
  markAsReplied,
  deleteContact,
} from "../controllers/contactController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public ─────────────────────────────────────────────────
router.post("/", createContact);

// ── Admin only ─────────────────────────────────────────────
router.get("/", authMiddleware, getAllContacts);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.get("/:id", authMiddleware, getContactById);
router.patch("/:id/read", authMiddleware, markAsRead);
router.patch("/:id/replied", authMiddleware, markAsReplied);
router.delete("/:id", authMiddleware, deleteContact);

export default router;