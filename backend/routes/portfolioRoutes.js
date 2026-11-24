const express = require("express");
const { getPortfolio } = require("../controllers/portfolioController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getPortfolio);

module.exports = router;
