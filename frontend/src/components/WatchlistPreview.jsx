import { Link } from "react-router-dom";
import { useWatchlist } from "../contexts/useWatchlist.js";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function WatchlistPreview({ stocks }) {
  const { symbols } = useWatchlist();
  const savedStocks = symbols
    .map((symbol) => stocks.find((stock) => stock.symbol === symbol))
    .filter(Boolean);

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800 p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-50">Your watchlist</h2>
          <p className="mt-1 text-xs text-slate-400">Saved stocks and their current simulated prices.</p>
        </div>
        <Link to="/watchlist" className="text-sm font-semibold text-violet-300 transition hover:text-violet-200">
          View all
        </Link>
      </div>

      {savedStocks.length ? (
        <div className="divide-y divide-slate-700">
          {savedStocks.slice(0, 4).map((stock) => (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
              className="flex items-center justify-between gap-3 py-3 transition first:pt-0 last:pb-0 hover:text-violet-200"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-100">{stock.symbol}</span>
                <span className="block truncate text-xs text-slate-400">{stock.name}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-semibold text-slate-100">{formatCurrency(stock.price)}</span>
                <span className={`block text-xs ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {stock.change >= 0 ? "+" : ""}{formatCurrency(stock.change)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-700 px-4 py-5 text-center text-sm text-slate-400">
          No saved stocks yet. <Link to="/markets" className="font-semibold text-violet-300 hover:text-violet-200">Explore markets</Link> to add some.
        </p>
      )}
    </section>
  );
}
