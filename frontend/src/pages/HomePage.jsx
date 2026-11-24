import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import tradingDesk from "../assets/trading-desk.jpg";
import mobileTrading from "../assets/mobile-trading.jpg";
import marketScreen from "../assets/market-screen.jpg";
import investment from "../assets/investment.jpg";

export default function HomePage() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="items-center lg:flex">
            <div className="lg:w-1/2">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-200">
                Simple · Virtual · Educational
              </p>
              <h1 className="text-4xl font-bold leading-tight text-slate-50 lg:text-6xl">
                {user ? `Welcome back, ${user.name.split(" ")[0]}.` : "Invest in your practice."}
              </h1>
              <p className="mb-7 mt-5 max-w-xl text-base leading-7 text-slate-400">
                TradeNest gives you ₹1,00,000 of virtual cash to practise buying
                and selling Indian stocks. Track every move with a live simulated
                market, without risking real money.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/markets"
                  className="rounded-md bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-600"
                >
                  Browse Markets
                </Link>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="rounded-md border border-violet-400/40 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
                  >
                    Open Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="rounded-md border border-violet-400/40 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>

            <div className="relative mt-12 lg:mt-0 lg:w-1/2 lg:pl-12">
              <img
                src={tradingDesk}
                alt="Investor studying live market charts"
                className="h-[420px] w-full rounded-2xl object-cover shadow-2xl shadow-teal-950/40"
              />
              <div className="absolute -bottom-5 left-4 right-4 rounded-xl border border-white/10 bg-[#111827]/95 p-4 backdrop-blur-md sm:left-10 sm:right-auto sm:w-72">
                <p className="text-xs text-slate-400">Virtual portfolio</p>
                <p className="mt-1 text-xl font-bold text-slate-50">₹1,00,000.00</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Practice balance</span>
                  <span className="font-semibold text-emerald-400">Live updates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800/80 bg-[#162033]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
            <Feature number="01" title="Real-Time Prices" text="Stock prices update automatically every few seconds." />
            <Feature number="02" title="Virtual Trading" text="Buy and sell shares using a ₹1,00,000 practice wallet." />
            <Feature number="03" title="Portfolio Tracking" text="Track your investments and profit or loss live." />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-teal-200">
              Built for learning
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-50">
              Everything you need to practise.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <PhotoCard image={mobileTrading} title="Trade anywhere" text="A mobile-first workspace for quick virtual orders." />
            <PhotoCard image={marketScreen} title="Follow the market" text="Watch every stock move through a live simulated feed." />
            <PhotoCard image={investment} title="Build confidence" text="Learn safely before entering real financial markets." />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-amber-500 px-6 py-10 text-center shadow-xl shadow-teal-950/30 sm:px-10">
            <h2 className="text-2xl font-bold text-white">Ready to make your first practice trade?</h2>
            <p className="mt-2 text-sm font-medium text-slate-950/80">Join the simulated market and build your trading confidence.</p>
            <Link
              to="/signup"
              className="mt-6 inline-block rounded-md bg-violet-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-900"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Feature({ number, title, text }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-400/20 text-sm font-bold text-amber-300">
        {number}
      </span>
      <div>
        <h2 className="font-bold text-slate-100">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function PhotoCard({ image, title, text }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-xl shadow-slate-950/10">
      <img src={image} alt={title} className="h-52 w-full object-cover" />
      <div className="p-5">
        <h3 className="font-bold text-slate-100">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
      </div>
    </article>
  );
}
