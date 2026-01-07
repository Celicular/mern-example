const User = require("../models/User");
const Investment = require("../models/Investment");
const ROIHistory = require("../models/ROIHistory");
const LevelIncome = require("../models/LevelIncome");

const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all user's active investments
    const activeInvestments = await Investment.find({
      userId,
      status: "active",
    });

    // Calculate total invested amount
    const totalInvested = activeInvestments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );

    // Get today's ROI
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const todayROI = await ROIHistory.aggregate([
      {
        $match: {
          userId: user._id,
          calculationDate: dateString,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$roiAmount" },
        },
      },
    ]);

    const dailyROI = todayROI.length > 0 ? todayROI[0].total : 0;

    // Get total ROI earned (sum of all ROI history)
    const totalROIResult = await ROIHistory.aggregate([
      {
        $match: { userId: user._id },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$roiAmount" },
        },
      },
    ]);

    const totalROIEarned =
      totalROIResult.length > 0 ? totalROIResult[0].total : 0;

    // Get total level income earned
    const totalLevelIncomeResult = await LevelIncome.aggregate([
      {
        $match: { userId: user._id },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$incomeAmount" },
        },
      },
    ]);

    const totalLevelIncome =
      totalLevelIncomeResult.length > 0 ? totalLevelIncomeResult[0].total : 0;

    // Get today's level income
    const todayLevelIncome = await LevelIncome.aggregate([
      {
        $match: {
          userId: user._id,
          incomeDate: dateString,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$incomeAmount" },
        },
      },
    ]);

    const dailyLevelIncome =
      todayLevelIncome.length > 0 ? todayLevelIncome[0].total : 0;

    res.json({
      totalInvested,
      dailyROI,
      totalROIEarned,
      totalLevelIncome,
      dailyLevelIncome,
      currentBalance: user.balance,
      investmentCount: activeInvestments.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
};
