const mongoose = require("mongoose");

const levelIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
    },
    incomeAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    incomeDate: {
      type: String,
      required: true,
      // Format: YYYY-MM-DD
    },
    sourceUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

levelIncomeSchema.index(
  { userId: 1, referrerId: 1, sourceUserId: 1, incomeDate: 1 },
  { unique: true }
);

levelIncomeSchema.index({ incomeDate: 1 });

module.exports = mongoose.model("LevelIncome", levelIncomeSchema);
