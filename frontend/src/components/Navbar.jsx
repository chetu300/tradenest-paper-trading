import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import ThemeToggle from "./ThemeToggle.jsx";

const linkStyle = ({ isActive }) =>
  `block rounded-lg px-1.5 py-2 text-[10px] font-semibold tracking-wide transition lg:px-2 lg:text-xs xl:px-3 xl:text-sm ${
    isActive ? "bg-violet-500/20 text-violet-200" : "text-slate-400 hover:text-violet-200"
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const wallet = useSelector((state) => state.portfolio.data?.walletBalance);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function signOut() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-[#111827]/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-50">
          <img src="/tradenest-logo.svg" alt="TradeNest" className="h-9 w-9" />
          TradeNest
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex md:gap-1 lg:gap-2 xl:gap-3">
          <NavLink to="/" end className={linkStyle}>Home</NavLink>
          <NavLink to="/guide" className={linkStyle}>Guide</NavLink>
          <NavLink to="/careers" className={linkStyle}>Careers</NavLink>
          <NavLink to="/markets" className={linkStyle}>Markets</NavLink>
          <NavLink to="/watchlist" className={linkStyle}>Watchlist</NavLink>
          <NavLink to="/portfolio" className={linkStyle}>Investments</NavLink>
          <NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink>
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <ThemeToggle />
          <div className="text-right">
            <p className="text-xs text-slate-400">Virtual cash</p>
            <p className="text-sm font-semibold text-slate-100">{formatCurrency(wallet ?? user?.walletBalance)}</p>
          </div>
          <div className="h-9 w-px bg-slate-700" />
          <span className="max-w-32 truncate text-sm text-slate-300">{user?.name}</span>
          <button onClick={signOut} className="rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-600">Logout</button>
        </div>
        <div className="hidden items-center gap-3 md:flex xl:hidden">
          <ThemeToggle compact />
          {user && (
            <button onClick={signOut} className="rounded-md bg-violet-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-600">
              Logout
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle compact />
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Cash</p>
            <p className="text-xs font-semibold text-slate-100">{formatCurrency(wallet ?? user?.walletBalance)}</p>
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-9 w-9 place-items-center rounded-md border border-violet-400/40 bg-violet-500/10 text-violet-200 transition hover:bg-violet-500/20 md:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t border-slate-800 px-4 py-3 md:hidden">
          <NavLink to="/" end className={linkStyle} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/guide" className={linkStyle} onClick={() => setMenuOpen(false)}>Guide</NavLink>
          <NavLink to="/careers" className={linkStyle} onClick={() => setMenuOpen(false)}>Careers</NavLink>
          <NavLink to="/markets" className={linkStyle} onClick={() => setMenuOpen(false)}>Markets</NavLink>
          <NavLink to="/watchlist" className={linkStyle} onClick={() => setMenuOpen(false)}>Watchlist</NavLink>
          <NavLink to="/portfolio" className={linkStyle} onClick={() => setMenuOpen(false)}>Investments</NavLink>
          <NavLink to="/dashboard" className={linkStyle} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          {user && (
            <button onClick={signOut} className="mt-3 w-full rounded-md bg-violet-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-violet-600">
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
