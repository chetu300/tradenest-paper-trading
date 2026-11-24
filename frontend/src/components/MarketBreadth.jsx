export default function MarketBreadth({ risingCount, fallingCount, risingPercent }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Market breadth</span>
        <span className="font-medium text-slate-300">
          {risingCount} rising · {fallingCount} falling
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-700">
        <div className="bg-emerald-400" style={{ width: `${risingPercent}%` }} />
        <div className="bg-red-400" style={{ width: `${100 - risingPercent}%` }} />
      </div>
    </div>
  );
}
