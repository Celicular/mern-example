const Investment = require("../models/Investment");
const User = require("../models/User");
const { getDailyROIPercentageByPlan } = require("../utils/helpers");

const createInvestment = async (req, res) => {
  try {
    const { amount, plan } = req.body;
    const userId = req.userId;

    if (!amount || !plan) {
      return res.status(400).json({ message: "Amount and plan are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (!["3-months", "6-months", "12-months"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    if (plan === "3-months") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (plan === "6-months") {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (plan === "12-months") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const dailyROIPercentage = getDailyROIPercentageByPlan(plan);

    const investment = new Investment({
      userId,
      amount,
      plan,
      startDate,
      endDate,
      dailyROIPercentage,
      status: "active",
    });

    await investment.save();

    // Update user's total invested amount
    await User.updateOne({ _id: userId }, { $inc: { totalInvested: amount } });

    res.status(201).json({
      message: "Investment created successfully",
      investment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserInvestments = async (req, res) => {
  try {
    const userId = req.userId;

    const investments = await Investment.find({ userId }).sort({
      createdAt: -1,
    });

    res.json({
      investments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInvestment,
  getUserInvestments,
};
