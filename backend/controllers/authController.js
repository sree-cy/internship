const User = require("../models/User");
const AptitudeAttempt = require("../models/AptitudeAttempt");
const DSAAttempt = require("../models/DSAAttempt");
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
  const reqStart = Date.now();
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
    console.log(`\n==================================================`);
    console.log(`[PERF] [REGISTER] 1. API request received for: ${trimmedEmail} at ${new Date().toISOString()}`);

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
    const tFindStart = Date.now();
    const existingUser = await User.findOne({
      email: trimmedEmail,
    });
    console.log(`[PERF] [REGISTER] 2. MongoDB findOne completed in: ${Date.now() - tFindStart}ms`);

    if (existingUser) {
      // If user exists and is already verified, reject duplicate
      if (existingUser.isVerified !== false) {
        return res.status(400).json({
          message: "User already exists with this email",
        });
      }

      // If user exists but is unverified, refresh their registration & OTP
      const tHashStart = Date.now();
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(`[PERF] [REGISTER] 3. Bcrypt password hash completed in: ${Date.now() - tHashStart}ms`);

      const tOtpStart = Date.now();
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      console.log(`[PERF] [REGISTER] 4. OTP generated in: ${Date.now() - tOtpStart}ms`);

      const tSaveStart = Date.now();
      existingUser.name = trimmedName;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      existingUser.lastOtpSentAt = new Date();
      await existingUser.save();
      console.log(`[PERF] [REGISTER] 5. MongoDB save completed in: ${Date.now() - tSaveStart}ms`);

      const tMailStart = Date.now();
      console.log(`[PERF] [REGISTER] 6. Nodemailer sendMail started...`);
      await sendVerificationEmail(existingUser.email, existingUser.name, otp);
      console.log(`[PERF] [REGISTER] 6. Nodemailer sendMail completed in: ${Date.now() - tMailStart}ms`);

      console.log(`[PERF] [REGISTER] 7. API response sent! Total request time: ${Date.now() - reqStart}ms`);
      console.log(`==================================================\n`);

      return res.status(200).json({
        success: true,
        message: "Account already exists but was unverified. A new verification OTP has been sent.",
        email: existingUser.email,
        timings: {
          mongoFindMs: tSaveStart - tFindStart,
          bcryptHashMs: tOtpStart - tHashStart,
          otpGenMs: tSaveStart - tOtpStart,
          mongoSaveMs: tMailStart - tSaveStart,
          nodemailerSendMs: Date.now() - tMailStart,
          totalApiTurnaroundMs: Date.now() - reqStart,
        },
      });
    }

    // Hash password
    const tHashStart = Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);
    const tHashDuration = Date.now() - tHashStart;
    console.log(`[PERF] [REGISTER] 3. Bcrypt password hash completed in: ${tHashDuration}ms`);

    // Generate 6-digit OTP (expires in 10 minutes)
    const tOtpStart = Date.now();
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const tOtpDuration = Date.now() - tOtpStart;
    console.log(`[PERF] [REGISTER] 4. OTP generated in: ${tOtpDuration}ms`);

    // Create user with isVerified: false
    const tSaveStart = Date.now();
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry,
      lastOtpSentAt: new Date(),
    });
    const tSaveDuration = Date.now() - tSaveStart;
    console.log(`[PERF] [REGISTER] 5. MongoDB create completed in: ${tSaveDuration}ms`);

    // Send verification OTP via email
    const tMailStart = Date.now();
    console.log(`[PERF] [REGISTER] 6. Nodemailer sendMail started...`);
    const mailResult = await sendVerificationEmail(user.email, user.name, otp);
    const tMailDuration = Date.now() - tMailStart;
    console.log(`[PERF] [REGISTER] 6. Nodemailer sendMail completed in: ${tMailDuration}ms`);

    const totalDuration = Date.now() - reqStart;
    console.log(`[PERF] [REGISTER] 7. API response sent! Total request time: ${totalDuration}ms`);
    console.log(`==================================================\n`);

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
      timings: {
        mongoFindMs: tHashStart - tFindStart,
        bcryptHashMs: tHashDuration,
        otpGenMs: tOtpDuration,
        mongoSaveMs: tSaveDuration,
        nodemailerSendMs: tMailDuration,
        totalApiTurnaroundMs: totalDuration,
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
  const reqStart = Date.now();
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    console.log(`\n==================================================`);
    console.log(`[PERF] [RESEND-OTP] 1. API request received for: ${trimmedEmail} at ${new Date().toISOString()}`);

    const tFindStart = Date.now();
    const user = await User.findOne({ email: trimmedEmail });
    console.log(`[PERF] [RESEND-OTP] 2. MongoDB findOne completed in: ${Date.now() - tFindStart}ms`);

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

    const tOtpStart = Date.now();
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    console.log(`[PERF] [RESEND-OTP] 3. OTP generated in: ${Date.now() - tOtpStart}ms`);

    const tSaveStart = Date.now();
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.lastOtpSentAt = new Date();
    await user.save();
    console.log(`[PERF] [RESEND-OTP] 4. MongoDB save completed in: ${Date.now() - tSaveStart}ms`);

    const tMailStart = Date.now();
    console.log(`[PERF] [RESEND-OTP] 5. Nodemailer sendMail started...`);
    await sendVerificationEmail(user.email, user.name, otp);
    const tMailDuration = Date.now() - tMailStart;
    console.log(`[PERF] [RESEND-OTP] 5. Nodemailer sendMail completed in: ${tMailDuration}ms`);
    const totalDuration = Date.now() - reqStart;
    console.log(`[PERF] [RESEND-OTP] 6. API response sent! Total request time: ${totalDuration}ms`);
    console.log(`==================================================\n`);

    res.status(200).json({
      success: true,
      message: "A new 6-digit OTP has been sent to your email.",
      timings: {
        mongoFindMs: tOtpStart - tFindStart,
        otpGenMs: tSaveStart - tOtpStart,
        mongoSaveMs: tMailStart - tSaveStart,
        nodemailerSendMs: tMailDuration,
        totalApiTurnaroundMs: totalDuration,
      },
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
  const reqStart = Date.now();
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please enter your registered email address",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    console.log(`\n==================================================`);
    console.log(`[PERF] [FORGOT-PASSWORD] 1. API request received for: ${trimmedEmail} at ${new Date().toISOString()}`);

    const tFindStart = Date.now();
    const user = await User.findOne({ email: trimmedEmail });
    console.log(`[PERF] [FORGOT-PASSWORD] 2. MongoDB findOne completed in: ${Date.now() - tFindStart}ms`);

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

    const tOtpStart = Date.now();
    const resetOtp = generateOTP();
    const resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    console.log(`[PERF] [FORGOT-PASSWORD] 3. OTP generated in: ${Date.now() - tOtpStart}ms`);

    const tSaveStart = Date.now();
    user.resetOtp = resetOtp;
    user.resetOtpExpiry = resetOtpExpiry;
    user.lastResetOtpSentAt = new Date();
    await user.save();
    console.log(`[PERF] [FORGOT-PASSWORD] 4. MongoDB save completed in: ${Date.now() - tSaveStart}ms`);

    const tMailStart = Date.now();
    console.log(`[PERF] [FORGOT-PASSWORD] 5. Nodemailer sendMail started...`);
    await sendPasswordResetEmail(user.email, user.name, resetOtp);
    const tMailDuration = Date.now() - tMailStart;
    console.log(`[PERF] [FORGOT-PASSWORD] 5. Nodemailer sendMail completed in: ${tMailDuration}ms`);

    const totalDuration = Date.now() - reqStart;
    console.log(`[PERF] [FORGOT-PASSWORD] 6. API response sent! Total request time: ${totalDuration}ms`);
    console.log(`==================================================\n`);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
      email: user.email,
      timings: {
        mongoFindMs: tOtpStart - tFindStart,
        otpGenMs: tSaveStart - tOtpStart,
        mongoSaveMs: tMailStart - tSaveStart,
        nodemailerSendMs: tMailDuration,
        totalApiTurnaroundMs: totalDuration,
      },
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
        phone: user.phone || "",
        education: user.education || "",
        targetRole: user.targetRole || "",
        skillLevel: user.skillLevel || "Beginner",
        preferredLanguage: user.preferredLanguage || "Python",
        profileImage: user.profileImage || "",
        isVerified: user.isVerified,
        authProvider: user.googleId ? "Google" : "Email",
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET USER PROFILE
// =========================
const getUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId).select("-password -otp -otpExpiry -resetOtp -resetOtpExpiry");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        education: user.education || "",
        targetRole: user.targetRole || "",
        skillLevel: user.skillLevel || "Beginner",
        preferredLanguage: user.preferredLanguage || "Python",
        profileImage: user.profileImage || "",
        isVerified: user.isVerified,
        authProvider: user.googleId ? "Google" : "Email",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// =========================
// UPDATE USER PROFILE
// =========================
const updateUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, phone, education, targetRole, skillLevel, preferredLanguage } = req.body;

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return res.status(400).json({ message: "Full Name cannot be empty" });
      }
      user.name = trimmedName;
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (education !== undefined) {
      user.education = education.trim();
    }

    if (targetRole !== undefined) {
      user.targetRole = targetRole.trim();
    }

    if (skillLevel !== undefined) {
      const validLevels = ["Beginner", "Intermediate", "Advanced"];
      if (validLevels.includes(skillLevel)) {
        user.skillLevel = skillLevel;
      }
    }

    if (preferredLanguage !== undefined) {
      const validLangs = ["Python", "Java", "C++", "C", "JavaScript"];
      if (validLangs.includes(preferredLanguage)) {
        user.preferredLanguage = preferredLanguage;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        education: user.education || "",
        targetRole: user.targetRole || "",
        skillLevel: user.skillLevel || "Beginner",
        preferredLanguage: user.preferredLanguage || "Python",
        profileImage: user.profileImage || "",
        isVerified: user.isVerified,
        authProvider: user.googleId ? "Google" : "Email",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Unable to update profile. Please try again." });
  }
};

// =========================================================================
// GET USER ANALYTICS / PROGRESS / REPORTS / ACHIEVEMENTS
// =========================================================================
const getUserAnalytics = async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // Fall back to query param
      }
    }

    if (!userId && req.query.userId) {
      userId = req.query.userId;
    }

    let userObj = null;
    if (userId) {
      userObj = await User.findById(userId).select("name email skillLevel targetRole preferredLanguage");
    }

    // Build query for user attempts
    const userQuery = userId ? { userId } : {};

    // Fetch user aptitude attempts
    let aptitudeAttempts = await AptitudeAttempt.find(userQuery).sort({ completedAt: -1, createdAt: -1 });

    // Fetch user dsa attempts
    let dsaAttempts = await DSAAttempt.find(userQuery).sort({ completedAt: -1, createdAt: -1 });

    // If a specific user query returned 0 attempts, check if any attempts exist without userId
    // for this user session or fallback gracefully
    const totalAptitudeCount = aptitudeAttempts.length;
    const totalDSACount = dsaAttempts.length;
    const totalAssessments = totalAptitudeCount + totalDSACount;

    // Aptitude stats
    let aptitudeAvgScore = "N/A";
    let aptitudeBestScore = "N/A";
    let aptitudeAvgPercentage = "N/A";
    let aptitudeBestPercentage = "N/A";
    let aptitudeQuestionsSolved = 0;

    if (totalAptitudeCount > 0) {
      const sumScore = aptitudeAttempts.reduce((acc, a) => acc + (a.score || 0), 0);
      const sumPerc = aptitudeAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
      aptitudeAvgScore = Math.round(sumScore / totalAptitudeCount);
      aptitudeAvgPercentage = Math.round(sumPerc / totalAptitudeCount);
      aptitudeBestScore = Math.max(...aptitudeAttempts.map((a) => a.score || 0));
      aptitudeBestPercentage = Math.max(...aptitudeAttempts.map((a) => a.percentage || 0));
      aptitudeQuestionsSolved = Math.round(sumScore / 3);
    }

    // DSA stats
    let dsaAvgScore = "N/A";
    let dsaBestScore = "N/A";
    let dsaAvgPercentage = "N/A";
    let dsaBestPercentage = "N/A";
    let dsaQuestionsSolved = 0;
    const dsaLanguagesUsed = new Set();

    if (totalDSACount > 0) {
      const sumScore = dsaAttempts.reduce((acc, a) => acc + (a.score || 0), 0);
      const sumPerc = dsaAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
      dsaAvgScore = Math.round(sumScore / totalDSACount);
      dsaAvgPercentage = Math.round(sumPerc / totalDSACount);
      dsaBestScore = Math.max(...dsaAttempts.map((a) => a.score || 0));
      dsaBestPercentage = Math.max(...dsaAttempts.map((a) => a.percentage || 0));
      dsaQuestionsSolved = dsaAttempts.reduce((acc, a) => acc + (a.passedQuestions || 0), 0);
      dsaAttempts.forEach((a) => {
        if (a.language) dsaLanguagesUsed.add(a.language.toLowerCase());
      });
    }

    // Overall metrics
    const totalQuestionsAttempted = (totalAptitudeCount * 20) + (totalDSACount * 2);
    const totalQuestionsSolved = aptitudeQuestionsSolved + dsaQuestionsSolved;
    let overallAccuracy = "N/A";
    if (totalQuestionsAttempted > 0) {
      overallAccuracy = Math.round((totalQuestionsSolved / totalQuestionsAttempted) * 100);
    }

    let overallPerformance = "N/A";
    if (totalAssessments > 0) {
      const allPercs = [
        ...aptitudeAttempts.map((a) => a.percentage || 0),
        ...dsaAttempts.map((a) => a.percentage || 0),
      ];
      const avg = Math.round(allPercs.reduce((a, b) => a + b, 0) / allPercs.length);
      if (avg >= 85) overallPerformance = "Exceptional";
      else if (avg >= 70) overallPerformance = "Strong Ready";
      else if (avg >= 50) overallPerformance = "Developing";
      else overallPerformance = "Foundational";
    }

    // Difficulty Breakdown
    const difficultyBreakdown = {
      aptitude: {
        easy: { attempts: 0, totalScore: 0, bestScore: 0 },
        medium: { attempts: 0, totalScore: 0, bestScore: 0 },
        hard: { attempts: 0, totalScore: 0, bestScore: 0 },
      },
      dsa: {
        easy: { attempts: 0, totalScore: 0, bestScore: 0, passed: 0 },
        medium: { attempts: 0, totalScore: 0, bestScore: 0, passed: 0 },
        hard: { attempts: 0, totalScore: 0, bestScore: 0, passed: 0 },
      },
    };

    aptitudeAttempts.forEach((a) => {
      const d = (a.difficulty || "easy").toLowerCase();
      if (difficultyBreakdown.aptitude[d]) {
        difficultyBreakdown.aptitude[d].attempts++;
        difficultyBreakdown.aptitude[d].totalScore += a.score || 0;
        if ((a.score || 0) > difficultyBreakdown.aptitude[d].bestScore) {
          difficultyBreakdown.aptitude[d].bestScore = a.score || 0;
        }
      }
    });

    dsaAttempts.forEach((a) => {
      const d = (a.difficulty || "easy").toLowerCase();
      if (difficultyBreakdown.dsa[d]) {
        difficultyBreakdown.dsa[d].attempts++;
        difficultyBreakdown.dsa[d].totalScore += a.score || 0;
        difficultyBreakdown.dsa[d].passed += a.passedQuestions || 0;
        if ((a.score || 0) > difficultyBreakdown.dsa[d].bestScore) {
          difficultyBreakdown.dsa[d].bestScore = a.score || 0;
        }
      }
    });

    // Recent attempts list
    const combinedRecent = [
      ...aptitudeAttempts.map((a) => ({
        id: a._id,
        module: "Round 1 — Aptitude",
        difficulty: a.difficulty,
        score: a.score,
        maxScore: 60,
        percentage: a.percentage,
        details: `${Math.round(a.score / 3)} / 20 correct`,
        date: a.completedAt || a.createdAt,
      })),
      ...dsaAttempts.map((a) => ({
        id: a._id,
        module: "Round 2 — Technical DSA",
        difficulty: a.difficulty,
        language: a.language || "python",
        score: a.score,
        maxScore: 60,
        percentage: a.percentage,
        details: `${a.passedQuestions || 0} / 2 problems solved`,
        date: a.completedAt || a.createdAt,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    // Achievements based strictly on actual user activity
    const achievements = [
      {
        id: "first_assessment",
        title: "First Step",
        description: "Complete your very first interview preparation assessment",
        icon: "🎯",
        category: "Milestone",
        unlocked: totalAssessments >= 1,
        progress: totalAssessments >= 1 ? "100%" : "0%",
        unlockedAt: totalAssessments >= 1 ? combinedRecent[combinedRecent.length - 1]?.date : null,
      },
      {
        id: "first_coding",
        title: "Code Runner",
        description: "Submit your first coding solution in Round 2 DSA",
        icon: "💻",
        category: "Coding",
        unlocked: totalDSACount >= 1,
        progress: totalDSACount >= 1 ? "100%" : "0%",
        unlockedAt: totalDSACount >= 1 ? dsaAttempts[dsaAttempts.length - 1]?.completedAt : null,
      },
      {
        id: "round_1_complete",
        title: "Aptitude Analyst",
        description: "Successfully complete a Round 1 Aptitude & Reasoning test",
        icon: "📊",
        category: "Aptitude",
        unlocked: totalAptitudeCount >= 1,
        progress: totalAptitudeCount >= 1 ? "100%" : "0%",
        unlockedAt: totalAptitudeCount >= 1 ? aptitudeAttempts[aptitudeAttempts.length - 1]?.completedAt : null,
      },
      {
        id: "high_scorer",
        title: "High Achiever (80%+)",
        description: "Score 80% or higher in any interview assessment",
        icon: "🌟",
        category: "Performance",
        unlocked: (aptitudeBestPercentage !== "N/A" && aptitudeBestPercentage >= 80) || (dsaBestPercentage !== "N/A" && dsaBestPercentage >= 80),
        progress: ((aptitudeBestPercentage !== "N/A" && aptitudeBestPercentage >= 80) || (dsaBestPercentage !== "N/A" && dsaBestPercentage >= 80)) ? "100%" : "In Progress",
      },
      {
        id: "consistent_learner",
        title: "Consistent Practitioner",
        description: "Complete 3 or more assessments across PrepGo modules",
        icon: "🔥",
        category: "Consistency",
        unlocked: totalAssessments >= 3,
        progress: `${Math.min(100, Math.round((totalAssessments / 3) * 100))}%`,
      },
      {
        id: "polyglot_coder",
        title: "Polyglot Programmer",
        description: "Practice technical challenges in 2 or more programming languages",
        icon: "🌐",
        category: "Coding",
        unlocked: dsaLanguagesUsed.size >= 2,
        progress: `${Math.min(100, Math.round((dsaLanguagesUsed.size / 2) * 100))}%`,
      },
      {
        id: "perfectionist",
        title: "Perfectionist (100%)",
        description: "Score a perfect 100% on any aptitude or coding round",
        icon: "🏆",
        category: "Excellence",
        unlocked: aptitudeBestPercentage === 100 || dsaBestPercentage === 100,
        progress: (aptitudeBestPercentage === 100 || dsaBestPercentage === 100) ? "100%" : "In Progress",
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        user: userObj ? { name: userObj.name, email: userObj.email, targetRole: userObj.targetRole } : null,
        metrics: {
          totalAssessments,
          aptitudeAttempts: totalAptitudeCount,
          aptitudeAvgScore,
          aptitudeBestScore,
          aptitudeAvgPercentage,
          aptitudeBestPercentage,
          dsaAttempts: totalDSACount,
          dsaAvgScore,
          dsaBestScore,
          dsaAvgPercentage,
          dsaBestPercentage,
          questionsAttempted: totalQuestionsAttempted,
          questionsSolved: totalQuestionsSolved,
          overallAccuracy,
          overallPerformance,
        },
        difficultyBreakdown,
        languagesUsed: Array.from(dsaLanguagesUsed),
        recentAttempts: combinedRecent,
        achievements,
      },
    });
  } catch (error) {
    console.error("Get User Analytics Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching user progress." });
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
  getUserProfile,
  updateUserProfile,
  getUserAnalytics,
};
