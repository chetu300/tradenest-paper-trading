const Trade = require("../models/Trade");
const User = require("../models/User");
const { getCurrentPrice } = require("../sockets/priceEngine");
const { roundMoney } = require("./tradeController");

function calculateRealizedPnl(trades) {
  const positions = new Map();
  let realizedPnl = 0;

  // Read trades from oldest to newest so the average buy price is correct.
  for (const trade of trades) {
    const position = positions.get(trade.symbol) || { quantity: 0, averagePrice: 0 };

    if (trade.side === "BUY") {
      const newQuantity = position.quantity + trade.quantity;
      position.averagePrice =
        (position.averagePrice * position.quantity + trade.price * trade.quantity) /
        newQuantity;
      position.quantity = newQuantity;
    } else if (position.quantity >= trade.quantity) {
      realizedPnl += (trade.price - position.averagePrice) * trade.quantity;
      position.quantity -= trade.quantity;
    }

    positions.set(trade.symbol, position);
  }

  return roundMoney(realizedPnl);
}

async function getPortfolio(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "Account not found." });

  const trades = await Trade.find({ user: req.userId }).sort({ createdAt: 1 }).lean();
  const realizedPnl = calculateRealizedPnl(trades);
  const holdings = user.holdings.map((holding) => {
    const currentPrice = getCurrentPrice(holding.symbol) ?? holding.averagePrice;
    const investedValue = roundMoney(holding.quantity * holding.averagePrice);
    const currentValue = roundMoney(holding.quantity * currentPrice);

    return {
      symbol: holding.symbol,
      quantity: holding.quantity,
      averagePrice: holding.averagePrice,
      currentPrice,
      investedValue,
      currentValue,
      pnl: roundMoney(currentValue - investedValue),
    };
  });

  const investedValue = roundMoney(
    holdings.reduce((sum, holding) => sum + holding.investedValue, 0),
  );
  const currentValue = roundMoney(
    holdings.reduce((sum, holding) => sum + holding.currentValue, 0),
  );

  const unrealizedPnl = roundMoney(currentValue - investedValue);

  return res.json({
    walletBalance: user.walletBalance,
    holdings,
    investedValue,
    currentValue,
    unrealizedPnl,
    realizedPnl,
    totalPnl: roundMoney(unrealizedPnl + realizedPnl),
    trades: trades.reverse(),
  });
}

module.exports = { getPortfolio, calculateRealizedPnl };
