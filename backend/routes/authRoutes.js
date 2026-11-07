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
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Registration & Verification (Rate limited)
router.post("/register", authLimiter, registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", authLimiter, resendOTP);

// Login (Rate limited)
router.post("/login", authLimiter, loginUser);

// Google OAuth
router.get("/google-client-id", getGoogleClientId);
router.post("/google", authLimiter, googleAuth);

// Password Reset Flow (Rate limited)
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", authLimiter, resetPassword);

// Profile (Protected by JWT)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Progress, Reports & Achievements (Protected by JWT)
router.get("/progress", protect, getUserAnalytics);
router.get("/reports", protect, getUserAnalytics);
router.get("/achievements", protect, getUserAnalytics);
router.get("/analytics", protect, getUserAnalytics);

module.exports = router;
