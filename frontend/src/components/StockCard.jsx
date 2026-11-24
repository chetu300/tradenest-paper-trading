import { formatCurrency } from "../utils/formatCurrency.js";
import { useNavigate } from "react-router-dom";
import StockChart from "./StockChart.jsx";
import { useWatchlist } from "../contexts/useWatchlist.js";

export default function StockCard({ stock, selected, onSelect }) {
  const navigate = useNavigate();
  const { symbols, toggleSymbol } = useWatchlist();
  const isSaved = symbols.includes(stock.symbol);
  const positive = stock.change >= 0;
  const openDetails = () => navigate(`/stock/${stock.symbol}`);
  const openBuy = () => navigate(`/stock/${stock.symbol}?trade=buy`);

  return (
    <article
      className={`mx-auto w-full max-w-xs overflow-hidden rounded-lg border bg-slate-900 shadow-lg transition ${
        selected
          ? "border-teal-300 ring-2 ring-teal-400/40"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
      <button type="button" onClick={() => onSelect?.(stock.symbol)} className="block w-full">
        <div className="grid h-32 place-items-center bg-slate-800 p-6">
          <div className="grid h-16 w-16 place-items-center rounded-full border border-teal-400/70 bg-slate-900 text-xl font-black text-teal-200 shadow-lg shadow-teal-950/30">
            {stock.symbol.slice(0, 2)}
          </div>
        </div>
        <div className="px-5 pt-5 text-center">
          <h2 className="font-bold text-slate-50">{stock.name}</h2>
          <p className="mt-1 text-xs text-slate-400">NSE:{stock.symbol}</p>
        </div>
        <div className="flex flex-col items-center px-5 py-5">
          <p className="font-semibold text-slate-100">{formatCurrency(stock.price)}</p>
          <p className={`mt-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? "+" : ""}{formatCurrency(stock.change)}
          </p>
          <StockChart stock={stock} compact />
        </div>
      </button>
      <div className="flex items-center justify-center gap-2 px-4 pb-5">
        <button type="button" onClick={openBuy} className="flex-1 rounded-md bg-violet-700 px-2 py-2 text-xs font-bold text-white transition hover:bg-violet-600 sm:text-sm">
          Buy
        </button>
        <button type="button" onClick={openDetails} className="flex-1 rounded-md border border-violet-400/40 bg-violet-500/10 px-2 py-2 text-xs font-semibold text-violet-200 transition hover:bg-violet-500/20 sm:text-sm">
          Details
        </button>
        <button
          type="button"
          onClick={() => toggleSymbol(stock.symbol)}
          aria-label={isSaved ? `Remove ${stock.symbol} from watchlist` : `Add ${stock.symbol} to watchlist`}
          aria-pressed={isSaved}
          title={isSaved ? "Remove from watchlist" : "Add to watchlist"}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border text-lg transition ${
            isSaved
              ? "border-violet-400 bg-violet-600 text-white hover:bg-violet-500"
              : "border-violet-400/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20"
          }`}
        >
          <span aria-hidden="true">{isSaved ? "★" : "☆"}</span>
        </button>
      </div>
    </article>
  );
}
