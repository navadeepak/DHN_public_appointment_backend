// src/models/user.model.js (Full Fixed Model with OTP Fields)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phno: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Valid 10-digit Indian mobile"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Valid email"],
    },
    address: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    isVerified: { type: Boolean, default: false },
    // OTP fields for registration flow
    otp: { type: String }, // Temporary OTP code
    otpExpires: { type: Date }, // OTP expiry time
  },
  { timestamps: true }
);

// Fixed pre-save hook: Fully async, no next() calls (Mongoose handles resolution)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
