const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/sendEmail");

// Helper to generate a secure 6-digit numeric OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper for email regex validation
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// =========================
// REGISTER
// =========================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: trimmedEmail,
    });

    if (existingUser) {
      // If user exists and is already verified, reject duplicate
      if (existingUser.isVerified !== false) {
        return res.status(400).json({
          message: "User already exists with this email",
        });
      }

      // If user exists but is unverified, refresh their registration & OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      existingUser.name = trimmedName;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      existingUser.lastOtpSentAt = new Date();
      await existingUser.save();

      await sendVerificationEmail(existingUser.email, existingUser.name, otp);

      return res.status(200).json({
        success: true,
        message: "Account already exists but was unverified. A new verification OTP has been sent.",
        email: existingUser.email,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP (expires in 10 minutes)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create user with isVerified: false
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry,
      lastOtpSentAt: new Date(),
    });

    // Send verification OTP via email
    await sendVerificationEmail(user.email, user.name, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for the verification code.",
      email: user.email,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// =========================
// VERIFY EMAIL
// =========================

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and 6-digit OTP are required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found with this email",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified. You can log in directly.",
        alreadyVerified: true,
      });
    }

    if (!user.otp || user.otp !== cleanOtp) {
      return res.status(400).json({
        message: "Invalid verification code. Please check and try again.",
      });
    }

    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new OTP.",
      });
    }

    // Mark verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now login.",
      isVerified: true,
    });

  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({
      message: "Server error while verifying email",
    });
  }
};


// =========================
// RESEND OTP
// =========================

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified. You can log in directly.",
      });
    }

    // Rate limiting: 60 seconds cooldown
    if (user.lastOtpSentAt) {
      const elapsed = Date.now() - new Date(user.lastOtpSentAt).getTime();
      const COOLDOWN_MS = 60 * 1000;
      if (elapsed < COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        return res.status(429).json({
          message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
          retryAfter: remainingSeconds,
        });
      }
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.lastOtpSentAt = new Date();
    await user.save();

    await sendVerificationEmail(user.email, user.name, otp);

    res.status(200).json({
      success: true,
      message: "A new 6-digit OTP has been sent to your email.",
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({
      message: "Server error while resending OTP",
    });
  }
};


// =========================
// FORGOT PASSWORD
// =========================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please enter your registered email address",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email address.",
      });
    }

    // Rate limiting: 60 seconds cooldown
    if (user.lastResetOtpSentAt) {
      const elapsed = Date.now() - new Date(user.lastResetOtpSentAt).getTime();
      const COOLDOWN_MS = 60 * 1000;
      if (elapsed < COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        return res.status(429).json({
          message: `Please wait ${remainingSeconds} seconds before requesting another code.`,
          retryAfter: remainingSeconds,
        });
      }
    }

    const resetOtp = generateOTP();
    const resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = resetOtp;
    user.resetOtpExpiry = resetOtpExpiry;
    user.lastResetOtpSentAt = new Date();
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetOtp);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
      email: user.email,
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      message: "Server error while processing forgot password request",
    });
  }
};


// =========================
// VERIFY RESET OTP
// =========================

const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and 6-digit OTP are required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.resetOtp || user.resetOtp !== cleanOtp) {
      return res.status(400).json({
        message: "Invalid password reset code. Please check and try again.",
      });
    }

    if (!user.resetOtpExpiry || new Date() > new Date(user.resetOtpExpiry)) {
      return res.status(400).json({
        message: "Reset code has expired. Please request a new OTP.",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You may now reset your password.",
      valid: true,
    });

  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    res.status(500).json({
      message: "Server error while verifying reset OTP",
    });
  }
};


// =========================
// RESET PASSWORD
// =========================

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, password } = req.body;
    const finalPassword = newPassword || password;

    if (!email || !otp || !finalPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required",
      });
    }

    if (finalPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.resetOtp || user.resetOtp !== cleanOtp) {
      return res.status(400).json({
        message: "Invalid reset code. Please request a new OTP.",
      });
    }

    if (!user.resetOtpExpiry || new Date() > new Date(user.resetOtpExpiry)) {
      return res.status(400).json({
        message: "Reset code has expired. Please request a new OTP.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      message: "Server error while resetting password",
    });
  }
};


// =========================
// LOGIN
// =========================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: trimmedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check email verification status
    // If explicitly false, block login
    if (user.isVerified === false) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        isVerified: false,
        email: user.email,
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
