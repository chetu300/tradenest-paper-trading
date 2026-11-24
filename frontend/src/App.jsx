import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { connectionChanged, pricesUpdated } from "./features/prices/pricesSlice.js";
import { restoreSession } from "./features/auth/authSlice.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import MarketsPage from "./pages/MarketsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import CareersPage from "./pages/CareersPage.jsx";
import StockDetailsPage from "./pages/StockDetailsPage.jsx";
import WatchlistPage from "./pages/WatchlistPage.jsx";
import { priceSocket } from "./services/socket.js";

export default function App() {
  const dispatch = useDispatch();
  const isRestoring = useSelector((state) => state.auth.isRestoring);

  useEffect(() => {
    if (localStorage.getItem("trade-sim-token")) dispatch(restoreSession());

    const handlePrices = (prices) => dispatch(pricesUpdated(prices));
    const handleConnect = () => dispatch(connectionChanged(true));
    const handleDisconnect = () => dispatch(connectionChanged(false));

    priceSocket.on("prices:update", handlePrices);
    priceSocket.on("connect", handleConnect);
    priceSocket.on("disconnect", handleDisconnect);
    priceSocket.connect();

    return () => {
      priceSocket.off("prices:update", handlePrices);
      priceSocket.off("connect", handleConnect);
      priceSocket.off("disconnect", handleDisconnect);
      priceSocket.disconnect();
    };
  }, [dispatch]);

  if (isRestoring) {
    return <main className="grid min-h-screen place-items-center text-slate-300">Restoring your session...</main>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/markets" element={<MarketsPage />} />
      <Route path="/stock/:symbol" element={<StockDetailsPage />} />
      <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
      <Route path="/watchlist" element={<WatchlistPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
