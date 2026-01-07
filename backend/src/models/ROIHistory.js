const mongoose = require("mongoose");

const roiHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    investmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },
    roiAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    calculationDate: {
      type: String,
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

roiHistorySchema.index(
  { userId: 1, investmentId: 1, calculationDate: 1 },
  { unique: true }
);

roiHistorySchema.index({ calculationDate: 1 });

module.exports = mongoose.model("ROIHistory", roiHistorySchema);
