export function getLivePortfolio(portfolio, stocks) {
  if (!portfolio) return null;

  const pricesBySymbol = new Map(stocks.map((stock) => [stock.symbol, stock.price]));
  const holdings = portfolio.holdings.map((holding) => {
    const currentPrice = pricesBySymbol.get(holding.symbol) ?? holding.currentPrice;
    const currentValue = holding.quantity * currentPrice;
    const investedValue = holding.quantity * holding.averagePrice;

    return {
      ...holding,
      currentPrice,
      currentValue,
      investedValue,
      pnl: currentValue - investedValue,
    };
  });
  const investedValue = holdings.reduce((sum, holding) => sum + holding.investedValue, 0);
  const currentValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const unrealizedPnl = currentValue - investedValue;

  return {
    ...portfolio,
    holdings,
    investedValue,
    currentValue,
    unrealizedPnl,
    totalPnl: unrealizedPnl + portfolio.realizedPnl,
  };
}
