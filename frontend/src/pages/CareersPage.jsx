import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function CareersPage() {
  const jobs = [
    ["Front-End Engineer", "Engineering", "Bengaluru / Remote", "Build useful and accessible screens for traders."],
    ["Back-End Engineer", "Engineering", "Mumbai / Remote", "Build reliable APIs and virtual trading services."],
    ["DevOps Engineer", "Engineering", "Pune / Hybrid", "Deploy, test and maintain application services."],
    ["Staff Accountant", "Finance", "Delhi / On-site", "Track the project's virtual financial operations."],
    ["Product Manager", "Management", "Bengaluru / Hybrid", "Plan features and improve the student trading experience."],
    ["UI/UX Designer", "Design", "Remote", "Create simple, clear and responsive trading interfaces."],
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="px-4 py-16 text-center sm:px-6 lg:py-20">
          <h1 className="text-3xl font-extrabold text-slate-50 sm:text-4xl">
            Careers at TradeNest.
          </h1>
          <p className="mt-4 text-base text-slate-400">
            See the example job opportunities below.
          </p>
        </section>

        <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-6">
          {jobs.map(([title, department, location, description]) => (
            <article
              key={title}
              className="rounded-lg border border-slate-700 bg-slate-800 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase text-teal-200">
                  {department}
                </p>
                <span className="rounded-full bg-slate-700 px-2.5 py-1 text-[11px] text-slate-300">
                  {location}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold text-slate-100">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {description}
              </p>
              <p className="mt-5 text-sm font-medium text-red-400">
                Position unavailable
              </p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
