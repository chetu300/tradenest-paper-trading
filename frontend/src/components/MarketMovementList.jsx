import { formatCurrency } from "../utils/formatCurrency.js";

export default function MarketMovementList({ title, stocks, positive = false }) {
  const biggestMove = Math.max(1, ...stocks.map((stock) => Math.abs(stock.change)));
  const accentText = positive ? "text-emerald-400" : "text-red-400";
  const accentBar = positive ? "bg-emerald-400" : "bg-red-400";

  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">{title}</h3>
      {stocks.length ? (
        <div className="space-y-3">
          {stocks.map((stock) => (
            <MovementRow
              key={stock.symbol}
              stock={stock}
              biggestMove={biggestMove}
              positive={positive}
              accentText={accentText}
              accentBar={accentBar}
            />
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-xs text-slate-500">No stocks in this category.</p>
      )}
    </div>
  );
}

function MovementRow({ stock, biggestMove, positive, accentText, accentBar }) {
  const width = (Math.abs(stock.change) / biggestMove) * 100;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">{stock.symbol}</p>
          <p className="text-[10px] text-slate-500">{formatCurrency(stock.price)}</p>
        </div>
        <span className={`text-sm font-bold ${accentText}`}>
          {positive ? "+" : ""}{formatCurrency(stock.change)}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
        <div className={`h-full rounded-full ${accentBar}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
