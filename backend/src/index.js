const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const initializeScheduler = require("./services/scheduler");
const { calculateDailyROI } = require("./services/roiService");
const { calculateLevelIncome } = require("./services/levelIncomeService");

// Import routes
const authRoutes = require("./routes/authRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const referralRoutes = require("./routes/referralRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Initialize scheduler
initializeScheduler();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/referrals", referralRoutes);

// Admin route for manual testing - process daily calculations
app.post("/api/admin/process-daily-calculations", async (req, res) => {
  try {
    const result1 = await calculateDailyROI();
    const result2 = await calculateLevelIncome();

    res.json({
      message: "Daily calculations processed successfully",
      roi: result1,
      levelIncome: result2,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
