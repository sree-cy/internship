const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const dsaRoutes = require("./routes/dsaRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PrepGo Backend is running",
  });
});

// Dedicated active modules
app.use("/api/auth", authRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/dsa", dsaRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`PrepGo server running on port ${PORT}`);
});
