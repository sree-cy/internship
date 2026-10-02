const express = require("express");

const {
  registerUser,
  loginUser,
  verifyEmail,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUserAnalytics,
} = require("../controllers/authController");

const { googleAuth, getGoogleClientId } = require("../controllers/googleAuthController");

const router = express.Router();

// Registration & Verification
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);

// Login
router.post("/login", loginUser);

// Google OAuth
router.get("/google-client-id", getGoogleClientId);
router.post("/google", googleAuth);

// Password Reset Flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

// Profile
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

// Progress, Reports & Achievements (Real MongoDB Attempt Data)
router.get("/progress", getUserAnalytics);
router.get("/reports", getUserAnalytics);
router.get("/achievements", getUserAnalytics);
router.get("/analytics", getUserAnalytics);

module.exports = router;
