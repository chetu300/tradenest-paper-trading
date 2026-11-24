import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import OrderForm from "../components/OrderForm.jsx";
import StockCard from "../components/StockCard.jsx";
import StockChart from "../components/StockChart.jsx";
import PortfolioAllocationChart from "../components/PortfolioAllocationChart.jsx";
import MarketMovementChart from "../components/MarketMovementChart.jsx";
import { fetchPortfolio } from "../features/portfolio/portfolioSlice.js";
import { getLivePortfolio } from "../utils/getLivePortfolio.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import Footer from "../components/Footer.jsx";
import WatchlistPreview from "../components/WatchlistPreview.jsx";
import SummaryCard from "../components/SummaryCard.jsx";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.prices.stocks);
  const connected = useSelector((state) => state.prices.connected);
  const portfolioData = useSelector((state) => state.portfolio.data);
  const portfolioError = useSelector((state) => state.portfolio.error);
  const portfolio = useMemo(
    () => getLivePortfolio(portfolioData, stocks),
    [portfolioData, stocks],
  );
  const [selectedSymbol, setSelectedSymbol] = useState("TCS");
  const selectedStock = useMemo(
    () => stocks.find((stock) => stock.symbol === selectedSymbol) || stocks[0],
    [stocks, selectedSymbol],
  );

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const gainers = stocks.filter((stock) => stock.change >= 0).length;
  const portfolioPnl = portfolio?.totalPnl ?? 0;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-7 px-4 pb-10 pt-24 sm:px-6 md:pb-12 lg:px-8 lg:pt-28">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-teal-200">PAPER TRADING · INDIAN EQUITIES</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Your market, your practice.</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Explore simulated prices, practice orders, and learn how your portfolio responds.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 sm:self-auto">
            <span className={`h-2 w-2 rounded-full ${connected ? "animate-pulse bg-emerald-400" : "bg-amber-400"}`} />
            {connected ? "Live simulation" : "Connecting to price feed"}
          </div>
        </section>

        {portfolioError && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{portfolioError}</p>}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard label="Virtual cash" value={portfolio?.walletBalance ?? 100000} detail="Available balance" />
          <SummaryCard label="Portfolio value" value={portfolio?.currentValue} detail="Live market value" />
          <SummaryCard label="Total P&L" value={portfolioPnl} detail={portfolioPnl >= 0 ? "Profitable" : "In loss"} accent={portfolioPnl >= 0 ? "positive" : "negative"} />
          <SummaryCard label="Market breadth" value={`${gainers}/${stocks.length}`} detail="Stocks rising" accent="positive" />
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">Market watch</h2>
              <p className="mt-1 text-sm text-slate-400">Prices update every 2.5 seconds in this simulation.</p>
            </div>
            <span className="text-xs text-slate-500">NSE · Simulated</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {stocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} selected={stock.symbol === selectedSymbol} onSelect={setSelectedSymbol} />
            ))}
          </div>
        </section>

        <WatchlistPreview stocks={stocks} />

        <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-50">{selectedStock.name}</h2>
                <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  {selectedStock.symbol} · Live simulated price
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{formatCurrency(selectedStock.price)}</p>
                <p className={`text-sm ${selectedStock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {selectedStock.change >= 0 ? "+" : ""}{formatCurrency(selectedStock.change)}
                </p>
              </div>
            </div>
            <StockChart stock={selectedStock} />
          </div>
          <OrderForm stock={selectedStock} />
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PortfolioAllocationChart holdings={portfolio?.holdings || []} />
          <MarketMovementChart stocks={stocks} />
        </section>
      </main>
      <Footer />
    </>
  );
}
