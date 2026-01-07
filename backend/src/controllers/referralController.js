const User = require("../models/User");

const getReferralTree = async (req, res) => {
  try {
    const userId = req.userId;

    // Build tree recursively
    const tree = await buildReferralTree(userId);

    res.json({
      tree,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buildReferralTree = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  // Get all direct referrals
  const directReferrals = await User.find({ referredBy: userId });

  // Recursively build tree for each referral
  const children = await Promise.all(
    directReferrals.map(async (referral) => {
      return await buildReferralTree(referral._id);
    })
  );

  return {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    balance: user.balance,
    totalInvested: user.totalInvested,
    children: children.filter((child) => child !== null),
  };
};

module.exports = {
  getReferralTree,
};
