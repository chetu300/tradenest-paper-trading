import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import StockCard from "../components/StockCard.jsx";
import { useWatchlist } from "../contexts/useWatchlist.js";

export default function WatchlistPage() {
  const stocks = useSelector((state) => state.prices.stocks);
  const { symbols } = useWatchlist();
  const savedStocks = symbols
    .map((symbol) => stocks.find((stock) => stock.symbol === symbol))
    .filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl space-y-7 px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <section>
          <p className="text-sm font-semibold text-violet-300">YOUR SAVED STOCKS</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-50 sm:text-4xl">Watchlist</h1>
          <p className="mt-2 text-sm text-slate-400">
            Keep an eye on stocks you want to follow. Prices update with the simulator.
          </p>
        </section>

        {savedStocks.length ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedStocks.map((stock) => <StockCard key={stock.symbol} stock={stock} />)}
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center sm:p-12">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-violet-400/40 bg-violet-500/10 text-2xl text-violet-300">
              ☆
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-100">Your watchlist is empty</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Save stocks from the Markets page and they will appear here with their latest simulated prices.
            </p>
            <Link to="/markets" className="mt-5 inline-flex rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-600">
              Explore markets
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
