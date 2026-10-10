
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

const resetAdminPassword = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file."
      );
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error(
        "ADMIN_PASSWORD must contain at least 12 characters."
      );
    }

    await connectDB();

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await Admin.findOne({ email }).select("+password");

    if (admin) {
      admin.password = hashedPassword;

      if (ADMIN_NAME) {
        admin.name = ADMIN_NAME.trim();
      }

      await admin.save();

      console.log("Admin password updated successfully.");
    } else {
      await Admin.create({
        name: ADMIN_NAME?.trim() || "Admin",
        email,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin account created successfully.");
    }

    console.log(`Admin email: ${email}`);
  } catch (error) {
    console.error("Admin password reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

resetAdminPassword();
