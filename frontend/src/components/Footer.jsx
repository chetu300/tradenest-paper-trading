import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#111827] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-50">
              <img src="/tradenest-logo.svg" alt="TradeNest" className="h-9 w-9" />
              TradeNest
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              The trading platform for everyone. Practice with virtual money,
              not real market investments.
            </p>
          </div>

          <FooterLinks
            title="Info"
            links={[
              { label: "Guide", to: "/guide" },
              { label: "Careers", to: "/careers" },
            ]}
          />
          <FooterLinks
            title="Stack"
            links={[
              { label: "MERN", href: "https://www.mongodb.com/mern-stack" },
              { label: "Socket.IO", href: "https://socket.io/" },
            ]}
          />
          <FooterLinks
            title="Account"
            links={[
              { label: "Markets", to: "/markets" },
              { label: "Watchlist", to: "/watchlist" },
              { label: "Investments", to: "/portfolio" },
              { label: "Dashboard", to: "/dashboard" },
            ]}
          />
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-500">
            © TradeNest {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase text-slate-200">{title}</h2>
      <div className="mt-3 space-y-2">
        {links.map((link) =>
          link.to ? (
            <Link
              key={link.label}
              to={link.to}
              className="block text-sm text-slate-400 hover:text-teal-200"
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-slate-400 hover:text-teal-200"
            >
              {link.label}
            </a>
          ),
        )}
      </div>
    </div>
  );
}
