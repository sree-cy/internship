const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    profileImage: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    education: {
      type: String,
      default: "",
      trim: true,
    },

    targetRole: {
      type: String,
      default: "",
      trim: true,
    },

    skillLevel: {
      type: String,
      default: "Beginner",
      enum: ["Beginner", "Intermediate", "Advanced"],
    },

    preferredLanguage: {
      type: String,
      default: "Python",
      enum: ["Python", "Java", "C++", "C", "JavaScript"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    lastOtpSentAt: {
      type: Date,
      default: null,
    },

    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpiry: {
      type: Date,
      default: null,
    },

    lastResetOtpSentAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
