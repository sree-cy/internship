const rateLimit = require("express-rate-limit");

const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * Limiter for sensitive authentication endpoints:
 * Login, Register, Password Reset, Resend OTP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 500 : 30, // Generous in dev, strict in production
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests from this IP. Please try again after 15 minutes.",
  },
  skip: () => isDevelopment,
});

/**
 * Limiter for general API endpoints.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 5000 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down and try again shortly.",
  },
  skip: () => isDevelopment,
});

/**
 * Code execution rate limiter to prevent denial of service attacks.
 */
const executionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: isDevelopment ? 1000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many code execution requests. Please wait a moment before running more code.",
  },
  skip: () => isDevelopment,
});

module.exports = {
  authLimiter,
  apiLimiter,
  executionLimiter,
};
