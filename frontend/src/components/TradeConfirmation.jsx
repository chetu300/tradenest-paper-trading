import { useEffect } from "react";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function TradeConfirmation({
  stock,
  side,
  quantity,
  total,
  isTrading,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !isTrading) onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTrading, onCancel]);

  const isBuy = side === "BUY";
  const action = isBuy ? "Buy" : "Sell";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isTrading) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="trade-confirmation-title"
        aria-describedby="trade-confirmation-description"
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-2xl shadow-slate-950/40 sm:p-6"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
          Review your order
        </p>
        <h2 id="trade-confirmation-title" className="mt-2 text-xl font-bold text-slate-50">
          Confirm {action.toLowerCase()} order
        </h2>
        <p id="trade-confirmation-description" className="mt-2 text-sm text-slate-400">
          Check these details before placing your virtual trade.
        </p>

        <dl className="mt-5 space-y-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">Action</dt>
            <dd className={`font-bold ${isBuy ? "text-violet-300" : "text-red-400"}`}>{action} {stock.symbol}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">Shares</dt>
            <dd className="font-semibold text-slate-100">{quantity}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">Price per share</dt>
            <dd className="font-semibold text-slate-100">{formatCurrency(stock.price)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-slate-700 pt-3">
            <dt className="font-semibold text-slate-200">Estimated total</dt>
            <dd className="text-base font-bold text-slate-50">{formatCurrency(total)}</dd>
          </div>
        </dl>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          TradeNest uses virtual money. Prices may change as the simulation updates.
        </p>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isTrading}
            onClick={onCancel}
            autoFocus
            className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isTrading}
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isBuy ? "bg-violet-700 hover:bg-violet-600" : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {isTrading ? "Placing order..." : `Confirm ${action}`}
          </button>
        </div>
      </section>
    </div>
  );
}
