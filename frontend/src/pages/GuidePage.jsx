import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import dashboardScreenshot from "../assets/guide-dashboard-ui.jpg";
import marketsScreenshot from "../assets/guide-markets-ui.jpg";
import stockScreenshot from "../assets/guide-stock-ui.jpg";
import portfolioScreenshot from "../assets/guide-portfolio-ui.jpg";

export default function GuidePage() {
  const steps = [
    {
      number: "01",
      title: "Start with your practice account",
      text: "Create an account to receive virtual cash. Your dashboard keeps your available balance and portfolio summary in one place.",
      tip: "The balance is virtual and is only for learning the order flow.",
      image: dashboardScreenshot,
      imageAlt: "TradeNest dashboard showing virtual cash and portfolio metrics",
      link: "/signup",
      label: "Create Account",
    },
    {
      number: "02",
      title: "Explore the mock market",
      text: "Search the available Indian stocks by company name or ticker. Open a stock to see its simulated price chart and details.",
      tip: "Prices in TradeNest are generated for practice; they are not live exchange quotes.",
      image: marketsScreenshot,
      imageAlt: "TradeNest markets page with stock cards, prices, charts, and actions",
      link: "/markets",
      label: "Browse Markets",
    },
    {
      number: "03",
      title: "Place a virtual order",
      text: "Choose Buy or Sell, enter a whole-number share quantity, and review the estimated total before placing your order.",
      tip: "Buy orders need enough virtual cash. Sell orders require shares in your portfolio.",
      image: stockScreenshot,
      imageAlt: "TradeNest stock details page with a simulated price chart",
      link: "/markets",
      label: "Start Trading",
    },
    {
      number: "04",
      title: "Review your portfolio",
      text: "Follow your holdings, average buy price, current value, wallet balance, and profit or loss as simulated prices move.",
      tip: "Download a PDF statement from your portfolio when you want a copy of your practice trades.",
      image: portfolioScreenshot,
      imageAlt: "TradeNest portfolio page with holdings and profit and loss summary",
      link: "/portfolio",
      label: "View Portfolio",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="relative overflow-hidden border-b border-teal-800/60 bg-gradient-to-br from-teal-900/80 via-slate-900 to-slate-900 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Your first practice session</p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-50 sm:text-5xl">
              Learn TradeNest, step by step.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              From your first virtual cash balance to tracking portfolio P&amp;L,
              here is a quick visual guide to the mock trading experience.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-5 px-4 py-10 sm:px-6 lg:py-14">
          {steps.map((step, index) => (
            <article key={step.number} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-lg shadow-slate-950/10">
              <div className={`grid md:grid-cols-2 ${index % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <figure className="relative aspect-video w-full self-center overflow-hidden rounded-xl border border-slate-700 bg-slate-950 p-2.5 sm:p-3">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="h-full w-full rounded-lg object-cover object-center shadow-xl"
                  />
                  <figcaption className="absolute bottom-5 left-5 rounded-md border border-white/15 bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur">
                    TRADENEST · {step.number}
                  </figcaption>
                </figure>
                <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Step {step.number}</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-50 sm:text-2xl">{step.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{step.text}</p>
                  <p className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
                    <span className="font-bold">Quick tip: </span>{step.tip}
                  </p>
                  <Link
                    to={step.link}
                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-600"
                  >
                    {step.label}<span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mx-4 mb-14 rounded-2xl border border-slate-700 bg-slate-800/70 px-5 py-8 text-center sm:mx-auto sm:max-w-6xl sm:px-8">
          <p className="text-sm font-semibold text-slate-100">A quick reminder</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            TradeNest is a mock-trading simulator. All stock prices are simulated,
            and virtual balances have no cash value.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
