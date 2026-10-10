// controllers/authController.js
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

const isProd = process.env.NODE_ENV === "production";

// Shared cookie options.
// - path "/" so the cookie is available on all routes (not just /api).
// - sameSite "lax" works for localhost (different ports = same site).
// - secure only in production (localhost is HTTP).
const cookieOptions = () => ({
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 1000, // 1 hour — keep in sync with generateToken expiry
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admin = await Admin.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    const passwordMatches = admin
      ? await bcrypt.compare(password, admin.password)
      : false;

    // Keep a short debug log — remove or gate behind NODE_ENV later.
    if (!isProd) {
      console.log("[login]", { email: normalizedEmail, found: !!admin, passwordMatches });
    }

    if (!admin || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Make sure the JWT secret exists BEFORE calling generateToken.
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not set — cannot issue a token.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error.",
      });
    }

    // generateToken should read JWT_SECRET internally.
    const token = generateToken(admin._id);

    // 1) Set httpOnly cookie (preferred, XSS-safe).
    res.cookie("adminToken", token, cookieOptions());

    // 2) ALSO return the token in the body so the frontend can
    //    store it and send it as a Bearer header.
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token, // ← critical: frontend needs this
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────────
export const getAdminProfile = async (req, res, next) => {
  try {
    // authMiddleware attaches req.admin. Re-fetch to guarantee
    // the latest data and to never leak the password hash.
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────────────
export const logoutAdmin = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};