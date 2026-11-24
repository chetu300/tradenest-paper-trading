const express = require("express");
const { executeTrade } = require("../controllers/tradeController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", requireAuth, executeTrade);

module.exports = router;
