const Investment = require("../models/Investment");
const ROIHistory = require("../models/ROIHistory");
const User = require("../models/User");
const {
  getDateString,
  getDailyROIPercentageByPlan,
} = require("../utils/helpers");

const calculateDailyROI = async (calculationDate = null) => {
  const dateToProcess = calculationDate || getDateString();

  try {
    const activeInvestments = await Investment.find({
      status: "active",
    }).populate("userId");

    let totalROICalculated = 0;

    for (const investment of activeInvestments) {
      const existingROI = await ROIHistory.findOne({
        investmentId: investment._id,
        calculationDate: dateToProcess,
      });

      if (existingROI) {
        console.log(
          `ROI already calculated for investment ${investment._id} on ${dateToProcess}`
        );
        continue;
      }

      const investmentDate = new Date(investment.startDate);
      const processDate = new Date(dateToProcess);

      if (investmentDate > processDate) {
        continue;
      }

      if (
        investment.status !== "active" &&
        new Date(investment.endDate) < processDate
      ) {
        continue;
      }

      const dailyROI =
        (investment.amount * investment.dailyROIPercentage) / 100;

      const roiRecord = await ROIHistory.create({
        userId: investment.userId._id,
        investmentId: investment._id,
        roiAmount: dailyROI,
        calculationDate: dateToProcess,
      });

      await User.updateOne(
        { _id: investment.userId._id },
        { $inc: { balance: dailyROI } }
      );

      totalROICalculated += 1;
    }

    console.log(
      `Daily ROI calculation completed. ${totalROICalculated} records created for ${dateToProcess}`
    );
    return {
      success: true,
      recordsCreated: totalROICalculated,
      date: dateToProcess,
    };
  } catch (error) {
    console.error("Error in calculateDailyROI:", error.message);
    throw error;
  }
};

module.exports = {
  calculateDailyROI,
};
