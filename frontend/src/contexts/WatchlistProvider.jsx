import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { WatchlistContext } from "./watchlistContext.js";

function getStoredSymbols(owner) {
  try {
    const savedSymbols = localStorage.getItem(`tradenest-watchlist:${owner}`);
    const parsedSymbols = savedSymbols ? JSON.parse(savedSymbols) : [];
    return Array.isArray(parsedSymbols)
      ? parsedSymbols.filter((symbol) => typeof symbol === "string")
      : [];
  } catch (error) {
    console.error("Could not read the saved watchlist.", error);
    return [];
  }
}

export function WatchlistProvider({ children }) {
  const email = useSelector((state) => state.auth.user?.email);
  const owner = email?.toLowerCase() || "guest";
  const [watchlist, setWatchlist] = useState(() => ({
    owner,
    symbols: getStoredSymbols(owner),
  }));
  const storedSymbols = useMemo(() => getStoredSymbols(owner), [owner]);
  const symbols = watchlist.owner === owner ? watchlist.symbols : storedSymbols;

  useEffect(() => {
    if (watchlist.owner !== owner) return;

    try {
      localStorage.setItem(`tradenest-watchlist:${owner}`, JSON.stringify(symbols));
    } catch (error) {
      console.error("Could not save the watchlist.", error);
    }
  }, [owner, symbols, watchlist.owner]);

  function toggleSymbol(symbol) {
    setWatchlist({
      owner,
      symbols: symbols.includes(symbol)
        ? symbols.filter((item) => item !== symbol)
        : [...symbols, symbol],
    });
  }

  return (
    <WatchlistContext.Provider value={{ symbols, toggleSymbol }}>
      {children}
    </WatchlistContext.Provider>
  );
}
