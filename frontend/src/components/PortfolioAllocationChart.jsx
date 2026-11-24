import { useState } from "react";
import EmptyAllocationState from "./EmptyAllocationState.jsx";
import PortfolioAllocationLegend from "./PortfolioAllocationLegend.jsx";
import PortfolioDoughnut from "./PortfolioDoughnut.jsx";

export default function PortfolioAllocationChart({ holdings = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartHoldings = [...holdings]
    .filter((holding) => holding.currentValue > 0)
    .sort((a, b) => b.currentValue - a.currentValue);
  const total = chartHoldings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalPnl = chartHoldings.reduce((sum, holding) => sum + holding.pnl, 0);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 sm:p-6">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-50">Portfolio allocation</h2>
          <p className="mt-1 text-xs text-slate-400">Your holdings by current market value</p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-400">
          {chartHoldings.length} {chartHoldings.length === 1 ? "stock" : "stocks"}
        </span>
      </header>

      {!chartHoldings.length ? (
        <EmptyAllocationState />
      ) : (
        <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr] lg:grid-cols-1 xl:grid-cols-[200px_1fr]">
          <PortfolioDoughnut
            holdings={chartHoldings}
            total={total}
            highlightedHolding={chartHoldings[hoveredIndex]}
            onHover={setHoveredIndex}
          />
          <PortfolioAllocationLegend
            holdings={chartHoldings}
            total={total}
            totalPnl={totalPnl}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        </div>
      )}
    </div>
  );
}
