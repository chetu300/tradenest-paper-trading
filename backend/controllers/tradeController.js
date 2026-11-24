const Trade = require("../models/Trade");
const User = require("../models/User");
const { getCurrentPrice } = require("../sockets/priceEngine");

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function executeTrade(req, res) {
  const { symbol, side } = req.body;
  const quantity = Number(req.body.quantity);
  const stockSymbol = typeof symbol === "string" ? symbol.toUpperCase() : "";
  const tradeSide = typeof side === "string" ? side.toUpperCase() : "";
  const price = getCurrentPrice(stockSymbol);

  if (!price) {
    return res.status(400).json({ message: "That stock is not available." });
  }

  if (tradeSide !== "BUY" && tradeSide !== "SELL") {
    return res.status(400).json({ message: "Choose BUY or SELL." });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive whole number." });
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "Account not found." });
  }

  const total = roundMoney(price * quantity);
  let holding = null;

  for (let i = 0; i < user.holdings.length; i += 1) {
    if (user.holdings[i].symbol === stockSymbol) {
      holding = user.holdings[i];
      break;
    }
  }

  if (tradeSide === "BUY") {
    if (user.walletBalance < total) {
      return res.status(400).json({ message: "You do not have enough virtual cash." });
    }

    if (holding) {
      const oldCost = holding.averagePrice * holding.quantity;
      holding.quantity += quantity;
      holding.averagePrice = roundMoney((oldCost + total) / holding.quantity);
    } else {
      user.holdings.push({
        symbol: stockSymbol,
        quantity,
        averagePrice: price,
      });
    }

    user.walletBalance = roundMoney(user.walletBalance - total);
  } else {
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: "You do not own enough shares to sell." });
    }

    holding.quantity -= quantity;
    user.walletBalance = roundMoney(user.walletBalance + total);

    if (holding.quantity === 0) {
      const newHoldings = [];
      for (let i = 0; i < user.holdings.length; i += 1) {
        if (user.holdings[i].symbol !== stockSymbol) {
          newHoldings.push(user.holdings[i]);
        }
      }
      user.holdings = newHoldings;
    }
  }

  try {
    await user.save();
  } catch (error) {
    if (error.name === "VersionError") {
      return res.status(409).json({
        message: "Your account changed during this order. Please try again.",
      });
    }
    throw error;
  }

  const trade = await Trade.create({
    user: user._id,
    symbol: stockSymbol,
    side: tradeSide,
    quantity,
    price,
    total,
  });

  return res.status(201).json({
    message: `${tradeSide === "BUY" ? "Bought" : "Sold"} ${quantity} ${stockSymbol} share${quantity === 1 ? "" : "s"}.`,
    trade,
    walletBalance: user.walletBalance,
    holdings: user.holdings,
  });
}

module.exports = { executeTrade, roundMoney };
