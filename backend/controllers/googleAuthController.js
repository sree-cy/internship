const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Helper to get fresh OAuth2Client instance
 */
const getOAuthClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  return new OAuth2Client(clientId);
};

/**
 * Return public Google Client ID for frontend
 * Endpoint: GET /api/auth/google-client-id
 */
const getGoogleClientId = (req, res) => {
  res.status(200).json({
    clientId: process.env.GOOGLE_CLIENT_ID?.trim() || "",
  });
};

/**
 * Handle Google OAuth Sign-In / Sign-Up
 * Endpoint: POST /api/auth/google
 */
const googleAuth = async (req, res) => {
  try {
    const { token, credential, idToken } = req.body;
    const tokenToVerify = token || credential || idToken;

    if (!tokenToVerify) {
      return res.status(400).json({
        message: "Google ID Token is required",
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const client = getOAuthClient();

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: tokenToVerify,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error("Google token verification failed:", verifyError.message);
      return res.status(401).json({
        message: "Invalid or expired Google token",
      });
    }

    if (!payload || !payload.email) {
      return res.status(400).json({
        message: "Unable to retrieve user information from Google token",
      });
    }

    const { sub: googleId, email, name, picture } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists with this email
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      // User exists → update google details and verify
      let shouldSave = false;

      if (!user.googleId) {
        user.googleId = googleId;
        shouldSave = true;
      }

      if (!user.isVerified) {
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        shouldSave = true;
      }

      if (!user.profileImage && picture) {
        user.profileImage = picture;
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }
    } else {
      // New user from Google Sign In
      user = await User.create({
        name: name || "Google User",
        email: normalizedEmail,
        password: null,
        googleId,
        profileImage: picture || "",
        isVerified: true,
      });
    }

    // Generate JWT token (matches existing loginUser implementation)
    const authToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Return the same JSON structure used by the existing login API
    return res.status(200).json({
      message: "Login successful",
      token: authToken,
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
        authProvider: "Google",
      },
    });

  } catch (error) {
    console.error("Google Authentication Error:", error);
    return res.status(500).json({
      message: "Server error during Google authentication",
    });
  }
};

module.exports = {
  googleAuth,
  getGoogleClientId,
};
