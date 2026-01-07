const getDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getLevelPercentages = (level) => {
  const percentages = {
    1: 10,
    2: 5,
    3: 2,
  };
  return percentages[level] || 0;
};

const getDailyROIPercentageByPlan = (plan) => {
  const dailyPercentages = {
    "3-months": 0.5,
    "6-months": 0.3,
    "12-months": 0.2,
  };
  return dailyPercentages[plan] || 0;
};

module.exports = {
  getDateString,
  getLevelPercentages,
  getDailyROIPercentageByPlan,
};
