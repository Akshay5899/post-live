// pages/api/auth.js
import dbConnect from "../../lib/db";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect(); // connect to MongoDB Atlas

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action } = req.query; // action = "register" or "login"

  try {
    // ---------------- REGISTER ----------------
    if (action === "register") {
      const { name, email, password, mobile, photo } = req.body;

      // Validate fields
      if (!name || !email || !password || !mobile) {
        return res.status(400).json({ message: "All fields except photo are required" });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        mobile,
        photo: photo || "",
      });

      return res.status(201).json({ message: "Registration successful", user: newUser });
    }

    // ---------------- LOGIN ----------------
    if (action === "login") {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      // Sign JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          photo: user.photo,
        },
      });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error("Auth API error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
