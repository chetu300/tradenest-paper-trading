const stocks = require("../utils/stocks");

const prices = Object.fromEntries(
  stocks.map((stock) => [
    stock.symbol,
    {
      ...stock,
      price: stock.initialPrice,
      change: 0,
      history: [stock.initialPrice],
      historyTimestamps: [Date.now()],
    },
  ]),
);

let timer;

function getPrices() {
  return Object.values(prices).map((stock) => ({
    ...stock,
    history: [...stock.history],
  }));
}

function getCurrentPrice(symbol) {
  return prices[symbol]?.price ?? null;
}

function startPriceEngine(io) {
  if (timer) return;

  const broadcastPrices = () => {
    Object.values(prices).forEach((stock) => {
      const previousPrice = stock.price;
      // A random small percentage change makes the chart move like a mock market.
      const movement = (Math.random() - 0.49) * 0.008;
      stock.price = Number(Math.max(0.01, previousPrice * (1 + movement)).toFixed(2));
      stock.change = Number((stock.price - stock.initialPrice).toFixed(2));
      stock.changePercent = Number(((stock.change / stock.initialPrice) * 100).toFixed(2));
      stock.historyTimestamps = [...stock.historyTimestamps.slice(-119), Date.now()];
      // Keep five minutes of prices so the dashboard can switch chart ranges.
      stock.history = [...stock.history.slice(-119), stock.price];
    });

    io.emit("prices:update", getPrices());
  };

  broadcastPrices();
  timer = setInterval(broadcastPrices, 2500);
}

function stopPriceEngine() {
  if (timer) clearInterval(timer);
  timer = undefined;
}

module.exports = { getPrices, getCurrentPrice, startPriceEngine, stopPriceEngine };
