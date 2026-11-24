import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { placeTrade } from "../features/portfolio/portfolioSlice.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import TradeConfirmation from "./TradeConfirmation.jsx";

export default function OrderForm({ stock, initialSide = "BUY" }) {
  const [side, setSide] = useState(initialSide);
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isTrading, error, message } = useSelector((state) => state.portfolio);
  const isLoggedIn = useSelector((state) => Boolean(state.auth.token));
  const total = stock.price * (Number(quantity) || 0);

  async function submitOrder(event) {
    event.preventDefault();
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }
    setShowConfirmation(true);
  }

  const cancelConfirmation = useCallback(() => setShowConfirmation(false), []);

  async function confirmOrder() {
    setShowConfirmation(false);
    await dispatch(placeTrade({ symbol: stock.symbol, side, quantity: Number(quantity) }));
  }

  return (
    <form onSubmit={submitOrder} className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-50">Place an order</p>
          <p className="text-xs text-slate-400">At the current simulated price</p>
        </div>
        <span className="rounded-lg bg-slate-700 px-2.5 py-1 text-xs font-semibold">{stock.symbol}</span>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-900 p-1">
        {["BUY", "SELL"].map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setSide(item)}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              side === item
                ? item === "BUY" ? "bg-violet-600 text-white" : "bg-red-500 text-white"
                : "text-slate-400"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <label htmlFor="quantity" className="mb-2 block text-sm text-slate-300">Shares</label>
      <input
        id="quantity"
        type="number"
        min="1"
        step="1"
        required
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-3 text-slate-50 outline-none focus:border-teal-400"
      />

      <div className="my-4 flex justify-between text-sm">
        <span className="text-slate-400">Estimated total</span>
        <span className="font-semibold text-slate-100">{formatCurrency(total)}</span>
      </div>

      {error && <p role="alert" className="mb-3 text-sm text-red-400">{error}</p>}
      {message && <p role="status" className="mb-3 text-sm text-emerald-400">{message}</p>}

      <button
        type="submit"
        disabled={isTrading || !Number.isInteger(Number(quantity)) || Number(quantity) < 1}
        className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
          side === "BUY" ? "bg-violet-700 hover:bg-violet-600" : "bg-red-600 hover:bg-red-500"
        }`}
      >
        {!isLoggedIn
          ? "Log in to trade"
          : isTrading
            ? "Processing..."
            : `${side === "BUY" ? "Buy" : "Sell"} ${stock.symbol}`}
      </button>
      {showConfirmation && (
        <TradeConfirmation
          stock={stock}
          side={side}
          quantity={Number(quantity)}
          total={total}
          isTrading={isTrading}
          onCancel={cancelConfirmation}
          onConfirm={confirmOrder}
        />
      )}
    </form>
  );
}
