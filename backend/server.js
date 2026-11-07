const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// Security Headers
app.use(helmet());

// Production CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use("/api", apiLimiter);

// Root & Health check endpoints
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PrepGo Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    uptime: Math.round(process.uptime()),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Dedicated active modules
app.use("/api/auth", authRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/dsa", dsaRoutes);

// 404 Handler for undefined API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Express error handler
app.use((err, req, res, next) => {
  console.error("Unhandled request error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Process-level crash guards
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
});

const PORT = process.env.PORT || 5000;

// Start server after connecting to database
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`PrepGo server running on port ${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`\n[FATAL] Port ${PORT} is already in use by another process.`);
        console.error(`To resolve, kill the process using port ${PORT} or change PORT in .env\n`);
        process.exit(1);
      } else {
        console.error("Server listener error:", error);
      }
    });
  } catch (error) {
    console.error("Failed to start PrepGo server due to database connection error:", error.message);
    process.exit(1);
  }
};

startServer();
