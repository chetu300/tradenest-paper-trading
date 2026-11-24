import { formatCurrency } from "../utils/formatCurrency.js";

export default function TradeHistoryTable({ trades = [] }) {
  if (!trades.length) {
    return <p className="py-8 text-center text-sm text-slate-400">Completed orders will show up here.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Side</th>
            <th className="px-4 py-3">Shares</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {trades.map((trade) => (
            <tr key={trade._id}>
              <td className="px-4 py-3 font-semibold">{trade.symbol}</td>
              <td className={`px-4 py-3 font-semibold ${trade.side === "BUY" ? "text-emerald-400" : "text-red-400"}`}>
                {trade.side}
              </td>
              <td className="px-4 py-3 text-slate-300">{trade.quantity}</td>
              <td className="px-4 py-3 text-slate-300">{formatCurrency(trade.price)}</td>
              <td className="px-4 py-3 text-slate-100">{formatCurrency(trade.total)}</td>
              <td className="px-4 py-3 text-slate-400">
                {trade.createdAt ? new Date(trade.createdAt).toLocaleString("en-IN") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
