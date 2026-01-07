const express = require("express");
const {
  createInvestment,
  getUserInvestments,
} = require("../controllers/investmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createInvestment);
router.get("/", authMiddleware, getUserInvestments);

module.exports = router;
