import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, login } from "../features/auth/authSlice.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isLoading, error } = useSelector((state) => state.auth);
  const returnTo = location.state?.from || "/";

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);
  if (token) return <Navigate to={returnTo} replace />;

  async function submit(event) {
    event.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) navigate(returnTo);
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your virtual trading desk.">
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm text-slate-300">
          Email
          <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-50" />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-50" />
        </label>
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <button disabled={isLoading} className="w-full rounded-xl bg-violet-700 px-4 py-3 font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-600 disabled:opacity-50">
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        New to TradeNest? <Link to="/signup" state={location.state} className="font-semibold text-teal-200 hover:text-amber-300">Create an account</Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-800 p-7 shadow-2xl sm:p-9">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/login" className="inline-flex items-center gap-2 font-bold">
            <img src="/tradenest-logo.svg" alt="TradeNest" className="h-9 w-9" />
            <span>TradeNest</span>
          </Link>
          <ThemeToggle />
        </div>
        <h1 className="text-2xl font-bold text-slate-50">{title}</h1>
        <p className="mb-7 mt-2 text-sm text-slate-400">{subtitle}</p>
        {children}
        <p className="mt-6 text-center text-xs text-slate-500">Practice only. No real money or market orders.</p>
      </div>
    </main>
  );
}
