import { formatCurrency } from "../utils/formatCurrency.js";

const ranges = [
  { label: "1m", minutes: 1 },
  { label: "3m", minutes: 3 },
  { label: "5m", minutes: 5 },
];

export default function StockChartHeader({
  high,
  low,
  rangeChange,
  rangeChangePercent,
  selectedRange,
  setSelectedRange,
}) {
  const rising = rangeChange >= 0;

  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
      <div className="flex gap-4 text-xs">
        <div>
          <p className="text-slate-500">High</p>
          <p className="mt-1 font-medium text-slate-200">{formatCurrency(high)}</p>
        </div>
        <div>
          <p className="text-slate-500">Low</p>
          <p className="mt-1 font-medium text-slate-200">{formatCurrency(low)}</p>
        </div>
        <div>
          <p className="text-slate-500">Range change</p>
          <p className={`mt-1 font-medium ${rising ? "text-emerald-400" : "text-red-400"}`}>
            {rangeChange >= 0 ? "+" : ""}{formatCurrency(rangeChange)} ({rangeChangePercent >= 0 ? "+" : ""}{rangeChangePercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1" aria-label="Chart time range">
        {ranges.map((range) => (
          <button
            key={range.minutes}
            type="button"
            aria-pressed={selectedRange === range.minutes}
            onClick={() => setSelectedRange(range.minutes)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
              selectedRange === range.minutes
                ? "bg-violet-600 font-bold text-white"
                : "text-slate-400 transition hover:text-violet-200"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
