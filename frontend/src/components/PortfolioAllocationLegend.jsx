import { formatCurrency } from "../utils/formatCurrency.js";
import { portfolioChartColors } from "../data/chartColors.js";

export default function PortfolioAllocationLegend({
  holdings,
  total,
  totalPnl,
  hoveredIndex,
  setHoveredIndex,
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between border-b border-slate-700 pb-3">
        <span className="text-xs text-slate-400">Unrealized P&amp;L</span>
        <span className={`text-xs font-semibold ${totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {totalPnl >= 0 ? "+" : ""}{formatCurrency(totalPnl)}
        </span>
      </div>
      <div className="max-h-44 space-y-3 overflow-y-auto pr-1">
        {holdings.map((holding, index) => {
          const percent = total ? (holding.currentValue / total) * 100 : 0;
          const isHighlighted = hoveredIndex === index;

          return (
            <div
              key={holding.symbol}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`rounded-lg px-2 py-1.5 transition ${isHighlighted ? "bg-slate-700/60" : ""}`}
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: portfolioChartColors[index % portfolioChartColors.length] }}
                  />
                  <span className="truncate font-semibold text-slate-200">{holding.symbol}</span>
                </div>
                <span className="font-medium text-slate-300">{formatCurrency(holding.currentValue)}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-3 pl-[18px] text-[10px]">
                <span className="text-slate-500">{percent.toFixed(1)}% allocation</span>
                <span className={holding.pnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {holding.pnl >= 0 ? "+" : ""}{formatCurrency(holding.pnl)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
