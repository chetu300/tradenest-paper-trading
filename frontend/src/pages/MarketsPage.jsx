import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import StockCard from "../components/StockCard.jsx";
import StockChart from "../components/StockChart.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import Footer from "../components/Footer.jsx";

export default function MarketsPage() {
  const stocks = useSelector((state) => state.prices.stocks);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [listMode, setListMode] = useState(true);

  const filteredStocks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return stocks;
    return stocks.filter((stock) =>
      stock.name.toLowerCase().includes(query) ||
      stock.symbol.toLowerCase().includes(query),
    );
  }, [search, stocks]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="border-b border-slate-800/60 bg-slate-900 px-4 py-16 text-center sm:px-6 lg:py-20">
          <h1 className="text-3xl font-extrabold text-slate-50 sm:text-4xl">Browse our stocks.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            See our selection of popular Indian stocks. <br />
            Currently {stocks.length} stocks available for purchase.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by company or ticker..."
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-sm outline-none focus:border-teal-400"
            />
            <button
              type="button"
              aria-label={listMode ? "Switch to grid view" : "Switch to list view"}
              onClick={() => setListMode((mode) => !mode)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-violet-400/40 bg-violet-500/10 text-violet-200 transition hover:bg-violet-500/20"
            >
              {listMode ? "▦" : "☷"}
            </button>
          </div>

          {listMode ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredStocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-700 shadow-sm">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Ticker</th>
                    <th className="px-5 py-3">Current price</th>
                    <th className="px-5 py-3">Chart</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredStocks.map((stock) => (
                    <tr key={stock.symbol} className="bg-slate-900 hover:bg-slate-800">
                      <td className="px-5 py-4 font-medium text-slate-100">{stock.name}</td>
                      <td className="px-5 py-4 text-slate-300">{stock.symbol}</td>
                      <td className="px-5 py-4 text-slate-100">{formatCurrency(stock.price)}</td>
                      <td className="px-5 py-4"><StockChart stock={stock} compact /></td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => navigate(`/stock/${stock.symbol}?trade=buy`)} className="rounded-md bg-violet-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-600">Buy</button>
                          <button type="button" onClick={() => navigate(`/stock/${stock.symbol}`)} className="rounded-md border border-violet-400/40 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-200 transition hover:bg-violet-500/20">Details</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!filteredStocks.length && (
            <p className="py-16 text-center text-sm text-slate-400">No stocks match your search.</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
