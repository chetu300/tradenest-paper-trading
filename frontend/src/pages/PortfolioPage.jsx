import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import PortfolioTable from "../components/PortfolioTable.jsx";
import TradeHistoryTable from "../components/TradeHistoryTable.jsx";
import { fetchPortfolio } from "../features/portfolio/portfolioSlice.js";
import { getLivePortfolio } from "../utils/getLivePortfolio.js";
import { downloadStatement } from "../utils/statementGenerator.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import Footer from "../components/Footer.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function PortfolioPage() {
  const dispatch = useDispatch();
  const { data: portfolioData, isLoading, error } = useSelector((state) => state.portfolio);
  const stocks = useSelector((state) => state.prices.stocks);
  const user = useSelector((state) => state.auth.user);
  const data = useMemo(
    () => getLivePortfolio(portfolioData, stocks),
    [portfolioData, stocks],
  );

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-7 px-4 pb-10 pt-24 sm:px-6 md:pb-12 lg:px-8 lg:pt-28">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-teal-200">YOUR ACCOUNT</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">Portfolio</h1>
            <p className="mt-2 text-sm text-slate-400">A live view of your virtual holdings and completed trades.</p>
          </div>
          <button
            type="button"
            disabled={!data || !data.trades?.length}
            onClick={() => downloadStatement({ user, portfolio: data })}
            className="rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download statement
          </button>
        </section>

        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard label="Virtual cash" value={data?.walletBalance} detail="Available to invest" />
          <SummaryCard label="Invested" value={data?.investedValue} detail="Average buy cost" />
          <SummaryCard label="Current value" value={data?.currentValue} detail="Live holdings value" />
          <SummaryCard label="Total P&L" value={data?.totalPnl} detail={(data?.totalPnl ?? 0) >= 0 ? "Overall profitable" : "Overall loss"} accent={(data?.totalPnl ?? 0) >= 0 ? "positive" : "negative"} />
        </section>

        <section>
          <SectionHeading title="Your holdings" subtitle="Unrealized P&L compares current value with average buy cost." />
          {isLoading && !data ? (
            <p className="py-8 text-sm text-slate-400">Loading portfolio...</p>
          ) : (
            <PortfolioTable holdings={data?.holdings || []} />
          )}
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-800 p-3 sm:p-5">
          <SectionHeading title="Order history" subtitle="Your buy and sell orders, newest first." />
          <TradeHistoryTable trades={data?.trades || []} />
        </section>

        <p className="text-xs text-slate-500">Realized P&amp;L: {formatCurrency(data?.realizedPnl)} · Unrealized P&amp;L: {formatCurrency(data?.unrealizedPnl)}</p>
      </main>
      <Footer />
    </>
  );
}
