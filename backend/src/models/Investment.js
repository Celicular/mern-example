const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    plan: {
      type: String,
      enum: ["3-months", "6-months", "12-months"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    dailyROIPercentage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

investmentSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Investment", investmentSchema);
