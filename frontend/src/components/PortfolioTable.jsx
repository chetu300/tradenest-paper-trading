import { formatCurrency } from "../utils/formatCurrency.js";

export default function PortfolioTable({ holdings = [] }) {
  if (!holdings.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 px-5 py-12 text-center">
        <p className="font-medium text-slate-200">Your portfolio is waiting for its first trade</p>
        <p className="mt-1 text-sm text-slate-400">Buy a few shares from the dashboard to see them here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-slate-800 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-5 py-4">Stock</th>
            <th className="px-5 py-4">Shares</th>
            <th className="px-5 py-4">Avg. buy</th>
            <th className="px-5 py-4">Market price</th>
            <th className="px-5 py-4">Current value</th>
            <th className="px-5 py-4">P&amp;L</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700 bg-slate-850">
          {holdings.map((holding) => (
            <tr key={holding.symbol}>
              <td className="px-5 py-4 font-semibold text-slate-100">{holding.symbol}</td>
              <td className="px-5 py-4 text-slate-300">{holding.quantity}</td>
              <td className="px-5 py-4 text-slate-300">{formatCurrency(holding.averagePrice)}</td>
              <td className="px-5 py-4 text-slate-300">{formatCurrency(holding.currentPrice)}</td>
              <td className="px-5 py-4 text-slate-100">{formatCurrency(holding.currentValue)}</td>
              <td className={`px-5 py-4 font-semibold ${holding.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {holding.pnl >= 0 ? "+" : ""}{formatCurrency(holding.pnl)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
