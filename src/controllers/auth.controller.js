// src/controllers/auth.controller.js (Full Fixed Code - Matching Friend's Style, No Session, DB for OTP)
import User from '../models/user.model.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Transporter setup (like friend's code)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send Email (like friend's code, fixed template literal)
const sendEmail = async (email, otp) => {
  const mailOptions = {
    from: "Dental Health Net",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}, it is valid for 10 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Failed to send email");
  }
};

// Register - Step 1: Send OTP (like friend's code - save OTP to DB)
export const register = async (req, res) => {
  try {
    const { name, phno, email, address, password, confirmPassword } = req.body;

    // Validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered. Please login." });
    }

    // Generate OTP and expiry
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create new user with OTP
    const user = new User({
      name,
      phno,
      email,
      address,
      password, // Hashed in pre-save hook
      otp,
      otpExpires
    });

    // Save user
    await user.save();

    // Send OTP
    await sendEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP (like friend's style - find user, check OTP in DB, set verified)
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Check OTP expiry and match
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP expired." });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Set verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    // Save user
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

    res.status(201).json({ 
      message: "Registration successful", 
      user: { id: user._id, name: user.name, email: user.email },
      token 
    });
  } catch (error) {
    console.error("VerifyOTP Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Login (async function)
export const login = async (req, res) => {
  try {
    const { credential, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: credential }, { phno: credential }]
    });

    if (!user || !user.isVerified) {
      return res.status(401).json({ message: "Invalid credentials or unverified account" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

    res.status(200).json({ 
      message: "Login successful", 
      user: { id: user._id, name: user.name, email: user.email },
      token 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};