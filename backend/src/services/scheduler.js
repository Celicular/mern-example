const cron = require("node-cron");
const { calculateDailyROI } = require("./roiService");
const { calculateLevelIncome } = require("./levelIncomeService");

const initializeScheduler = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily calculation at midnight...");
    try {
      await calculateDailyROI();
      await calculateLevelIncome();
      console.log("Daily calculations completed successfully");
    } catch (error) {
      console.error("Error in scheduled daily calculations:", error.message);
    }
  });

  console.log("Daily scheduler initialized - will run at 00:00 every day");
};

module.exports = initializeScheduler;
