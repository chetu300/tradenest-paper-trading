import MarketBreadth from "./MarketBreadth.jsx";
import MarketMovementList from "./MarketMovementList.jsx";

export default function MarketMovementChart({ stocks = [] }) {
  const gainers = stocks
    .filter((stock) => stock.change >= 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 4);
  const losers = stocks
    .filter((stock) => stock.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 4);
  const risingCount = stocks.filter((stock) => stock.change >= 0).length;
  const fallingCount = stocks.length - risingCount;
  const risingPercent = stocks.length ? (risingCount / stocks.length) * 100 : 0;

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
      <header className="mb-5">
        <h2 className="font-semibold text-slate-50">Market movement</h2>
        <p className="mt-1 text-xs text-slate-400">Top gainers and losers right now</p>
      </header>

      <MarketBreadth
        risingCount={risingCount}
        fallingCount={fallingCount}
        risingPercent={risingPercent}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <MarketMovementList title="Top gainers" stocks={gainers} positive />
        <MarketMovementList title="Top losers" stocks={losers} />
      </div>
    </section>
  );
}
