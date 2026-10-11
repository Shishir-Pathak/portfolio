// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  throw new Error("MONGO_URI and JWT_SECRET must be configured in .env.");
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long.");
}

// Security
app.disable("x-powered-by");

// ─────────────────────────────────────────────────────────────
// Helmet — crossOriginResourcePolicy MUST be "cross-origin" so
// browsers on a different domain (Vercel) can read the response.
// ─────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ── Request logger ─────────────────────────────────────────
// Prints every request + response status so you can see exactly
// what URL the frontend is hitting and what the server replies.
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - startedAt;
    const color =
      res.statusCode >= 500
        ? "\x1b[31m" // red
        : res.statusCode >= 400
          ? "\x1b[33m" // yellow
          : "\x1b[32m"; // green
    console.log(
      `${color}${res.statusCode}\x1b[0m ${req.method} ${req.originalUrl} - ${ms}ms`
    );
  });
  next();
});

// ─────────────────────────────────────────────────────────────
// CORS — allow local dev + ANY *.vercel.app subdomain.
//
// Vercel generates a NEW preview URL for every deploy, so a
// hardcoded list gets stale fast. This regex approach means you
// never have to update this file again when Vercel changes URLs.
// You can also add a custom domain via the FRONTEND_URL env var.
// ─────────────────────────────────────────────────────────────
const staticAllowed = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173", // vite preview
];

// Optional: an extra origin passed via env (e.g. a custom domain)
const envOrigin = process.env.FRONTEND_URL?.trim();
if (envOrigin && !staticAllowed.includes(envOrigin)) {
  staticAllowed.push(envOrigin);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      const isLocalhost = staticAllowed.includes(origin);
      const isVercel = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

      if (isLocalhost || isVercel) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked origin:", origin);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request parsing
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running.",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/products", productRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/settings", siteSettingsRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Global error handler
app.use(errorMiddleware);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("");
      console.log("═══════════════════════════════════════════════");
      console.log(`  🚀 Server running at http://localhost:${PORT}`);
      console.log("");
      console.log("  📍 Routes registered:");
      console.log("     GET    /");
      console.log("     POST   /api/auth/login");
      console.log("     GET    /api/auth/me");
      console.log("     POST   /api/auth/logout");
      console.log("     GET    /api/about");
      console.log("     PUT    /api/about");
      console.log("     POST   /api/contact          ← public");
      console.log("     GET    /api/contact          ← admin");
      console.log("     GET    /api/contact/unread-count");
      console.log("     GET    /api/contact/:id");
      console.log("     PATCH  /api/contact/:id/read");
      console.log("     PATCH  /api/contact/:id/replied");
      console.log("     DELETE /api/contact/:id");
      console.log("     GET    /api/products         ← public");
      console.log("     GET    /api/products/:id     ← public");
      console.log("     POST   /api/products         ← admin");
      console.log("     PUT    /api/products/:id     ← admin");
      console.log("     DELETE /api/products/:id     ← admin");
      console.log("     GET    /api/experience       ← public");
      console.log("     GET    /api/experience/:id   ← public");
      console.log("     POST   /api/experience       ← admin");
      console.log("     PUT    /api/experience/:id   ← admin");
      console.log("     DELETE /api/experience/:id   ← admin");
      console.log("     GET    /api/settings         ← public");
      console.log("     PUT    /api/settings         ← admin");
      console.log("═══════════════════════════════════════════════");
      console.log("");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();