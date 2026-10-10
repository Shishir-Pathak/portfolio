import mongoose from "mongoose";
import Contact from "../models/Contact.js";

// ─────────────────────────────────────────────────────────────
// POST /api/contact  (public)
// ─────────────────────────────────────────────────────────────
export const createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required.",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt,
      },
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
// GET /api/contact  (admin)
// Query: ?status=unread|read|replied  ?search=...  ?page=1  ?limit=20
// ─────────────────────────────────────────────────────────────
export const getAllContacts = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && ["unread", "read", "replied"].includes(status)) {
      query.status = status;
    }
    if (search?.trim()) {
      const re = new RegExp(search.trim(), "i");
      query.$or = [{ name: re }, { email: re }, { message: re }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [contacts, total, unreadCount] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Contact.countDocuments(query),
      Contact.countDocuments({ status: "unread" }),
    ]);

    return res.status(200).json({
      success: true,
      data: contacts,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
        unreadCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/contact/unread-count  (admin)
// ─────────────────────────────────────────────────────────────
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Contact.countDocuments({ status: "unread" });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/contact/:id  (admin) — auto-marks as read
// ─────────────────────────────────────────────────────────────
export const getContactById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid id." });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found." });
    }

    if (contact.status === "unread") {
      contact.status = "read";
      await contact.save();
    }

    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/contact/:id/read  (admin)
// ─────────────────────────────────────────────────────────────
export const markAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found." });
    }
    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/contact/:id/replied  (admin)
// ─────────────────────────────────────────────────────────────
export const markAsReplied = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "replied" },
      { new: true }
    );
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found." });
    }
    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/contact/:id  (admin)
// ─────────────────────────────────────────────────────────────
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found." });
    }
    return res.status(200).json({ success: true, message: "Message deleted." });
  } catch (error) {
    next(error);
  }
};