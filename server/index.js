const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");  // ✅ Only once
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const excelRoutes = require("./routes/excel");
const analysisRoutes = require("./routes/analysis");



dotenv.config();
console.log("🔐 JWT_SECRET from env:", process.env.JWT_SECRET);

// Connect to MongoDB
connectDB();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// ✅ Middleware
app.use(cors());  // ⭐️ This enables frontend to access backend APIs
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/analysis", analysisRoutes);

// ✅ Health check routes
app.get("/", (req, res) => {
  res.send("✅ Backend is up and running at root path!");
});

app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.get("/api/test", (req, res) => {
  res.send("🏓 🎉 Backend is working — Welcome to the API!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
