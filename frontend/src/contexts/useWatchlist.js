import { useContext } from "react";
import { WatchlistContext } from "./watchlistContext.js";

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return context;
}
