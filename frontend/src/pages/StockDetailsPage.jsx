import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import OrderForm from "../components/OrderForm.jsx";
import StockChart from "../components/StockChart.jsx";
import Footer from "../components/Footer.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function StockDetailsPage() {
  const { symbol } = useParams();
  const [searchParams] = useSearchParams();
  const stocks = useSelector((state) => state.prices.stocks);
  const stock = stocks.find((item) => item.symbol === symbol?.toUpperCase());
  const initialSide = searchParams.get("trade")?.toUpperCase() === "SELL" ? "SELL" : "BUY";

  if (!stock) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-[70vh] place-items-center px-4 pt-20 text-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Stock not found</h1>
            <p className="mt-2 text-sm text-slate-400">This stock symbol is not in the TradeNest market.</p>
            <Link to="/markets" className="mt-5 inline-block rounded-lg bg-violet-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-600">
              Back to markets
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <Link to="/markets" className="text-sm font-semibold text-teal-200 hover:text-amber-300">
          ← All stocks
        </Link>

        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-teal-200">NSE · {stock.industry || "Indian equities"}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50 sm:text-4xl">{stock.name}</h1>
            <p className="mt-1 text-slate-400">{stock.symbol}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-3xl font-bold text-slate-50">{formatCurrency(stock.price)}</p>
            <p className={`mt-1 text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {isPositive ? "+" : ""}{formatCurrency(stock.change)} ({stock.changePercent?.toFixed(2) ?? "0.00"}%)
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold text-slate-50">Price movement</h2>
                <span className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Simulated live feed
                </span>
              </div>
              <StockChart stock={stock} />
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
              <h2 className="font-semibold text-slate-50">About {stock.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {stock.description || `${stock.name} is available to explore in the TradeNest stock simulator.`}
                {" "}Prices in this project are simulated for learning and are not live exchange quotes.
              </p>
            </div>
          </div>

          <OrderForm key={`${stock.symbol}-${initialSide}`} stock={stock} initialSide={initialSide} />
        </section>
      </main>
      <Footer />
    </>
  );
}
