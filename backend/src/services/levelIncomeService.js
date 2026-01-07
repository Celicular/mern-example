const User = require('../models/User');
const Investment = require('../models/Investment');
const LevelIncome = require('../models/LevelIncome');
const { getDateString, getLevelPercentages } = require('../utils/helpers');

const calculateLevelIncome = async (calculationDate = null) => {
  const dateToProcess = calculationDate || getDateString();

  try {
    const usersWithInvestments = await Investment.find({
      startDate: { $lte: new Date(dateToProcess) },
      status: 'active',
    }).distinct('userId');

    let totalIncomeRecordsCreated = 0;

    for (const userId of usersWithInvestments) {
      await processReferralIncome(userId, dateToProcess);
    }

    console.log(`Level income calculation completed for ${dateToProcess}`);
    return { success: true, date: dateToProcess };
  } catch (error) {
    console.error('Error in calculateLevelIncome:', error.message);
    throw error;
  }
};

const processReferralIncome = async (sourceUserId, calculationDate) => {
  const level1Referrals = await User.find({ referredBy: sourceUserId });

  for (const level1User of level1Referrals) {
    const level1Investments = await Investment.find({
      userId: level1User._id,
      status: 'active',
      startDate: { $lte: new Date(calculationDate) },
    });

    for (const investment of level1Investments) {
      const incomePercentage = getLevelPercentages(1);
      const incomeAmount = (investment.amount * incomePercentage) / 100;

      const existingIncome = await LevelIncome.findOne({
        userId: sourceUserId,
        referrerId: level1User._id,
        sourceUserId: level1User._id,
        incomeDate: calculationDate,
      });

      if (!existingIncome) {
        await LevelIncome.create({
          userId: sourceUserId,
          referrerId: level1User._id,
          level: 1,
          incomeAmount,
          incomeDate: calculationDate,
          sourceUserId: level1User._id,
        });

        await User.updateOne({ _id: sourceUserId }, { $inc: { balance: incomeAmount } });
      }

      await processLevel2Income(sourceUserId, level1User._id, investment, calculationDate);
    }
  }
};

const processLevel2Income = async (originalReferrerId, level1UserId, investment, calculationDate) => {
  const level2Referrals = await User.find({ referredBy: level1UserId });

  for (const level2User of level2Referrals) {
    const incomePercentage = getLevelPercentages(2);
    const incomeAmount = (investment.amount * incomePercentage) / 100;

    const existingIncome = await LevelIncome.findOne({
      userId: originalReferrerId,
      referrerId: level2User._id,
      sourceUserId: investment.userId,
      incomeDate: calculationDate,
    });

    if (!existingIncome) {
      await LevelIncome.create({
        userId: originalReferrerId,
        referrerId: level2User._id,
        level: 2,
        incomeAmount,
        incomeDate: calculationDate,
        sourceUserId: investment.userId,
      });

      await User.updateOne(
        { _id: originalReferrerId },
        { $inc: { balance: incomeAmount } }
      );
    }

    await processLevel3Income(originalReferrerId, level2User._id, investment, calculationDate);
  }
};

const processLevel3Income = async (originalReferrerId, level2UserId, investment, calculationDate) => {
  const level3Referrals = await User.find({ referredBy: level2UserId });

  for (const level3User of level3Referrals) {
    const incomePercentage = getLevelPercentages(3);
    const incomeAmount = (investment.amount * incomePercentage) / 100;

    const existingIncome = await LevelIncome.findOne({
      userId: originalReferrerId,
      referrerId: level3User._id,
      sourceUserId: investment.userId,
      incomeDate: calculationDate,
    });

    if (!existingIncome) {
      await LevelIncome.create({
        userId: originalReferrerId,
        referrerId: level3User._id,
        level: 3,
        incomeAmount,
        incomeDate: calculationDate,
        sourceUserId: investment.userId,
      });

      await User.updateOne(
        { _id: originalReferrerId },
        { $inc: { balance: incomeAmount } }
      );
    }
  }
};

module.exports = {
  calculateLevelIncome,
};
