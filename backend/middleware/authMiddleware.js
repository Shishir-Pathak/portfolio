// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const authMiddleware = async (req, res, next) => {
  try {
    // ── 1. Prefer Authorization: Bearer <token> ──────────────
    const header = req.headers.authorization || "";
    let token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

    // ── 2. Fall back to the httpOnly cookie ──────────────────
    if (!token && req.cookies?.adminToken) {
      token = req.cookies.adminToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // ── 3. Verify signature + issuer + audience ─────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "portfolio-api",
      audience: "portfolio-admin",
    });

    // ── 4. Sanity-check the payload ─────────────────────────
    if (
      decoded.role !== "admin" ||
      !mongoose.isValidObjectId(decoded.sub)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // ── 5. Ensure the admin still exists & is still an admin ─
    const admin = await Admin.findById(decoded.sub).select("-password");

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      console.error("❌ Auth middleware:", error.name, "-", error.message);
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid. Please log in again.",
      });
    }

    next(error);
  }
};

export default authMiddleware;