const express = require("express");
const questionRoutes = require("./routes/questionRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const questionSetRoutes = require("./routes/questionSetRoutes");
const answerRoutes = require("./routes/answerRoutes");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

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

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);


app.use("/api/questions", questionRoutes);


app.use(
  "/api/attempts",
  attemptRoutes
);

app.use("/api/question-sets", questionSetRoutes);
app.use("/api/answers", answerRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`PrepGo server running on port ${PORT}`);
});
