const express = require("express");
const { getReferralTree } = require("../controllers/referralController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/tree", authMiddleware, getReferralTree);

module.exports = router;
