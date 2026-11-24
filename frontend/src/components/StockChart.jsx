import { useState } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import StockChartHeader from "./StockChartHeader.jsx";
import { createStockChartData, createStockChartOptions } from "../utils/stockChartConfig.js";
import { useTheme } from "../contexts/useTheme.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const updateIntervalMs = 2500;

export default function StockChart({ stock, compact = false }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [selectedRange, setSelectedRange] = useState(5);
  const allPrices = stock.history?.length ? stock.history : [stock.price];
  const pointLimit = compact
    ? allPrices.length
    : Math.ceil((selectedRange * 60 * 1000) / updateIntervalMs);
  const history = allPrices.slice(-pointLimit);
  const timestamps = (stock.historyTimestamps || []).slice(-history.length);
  const startPrice = history[0] ?? stock.price;
  const endPrice = history[history.length - 1] ?? stock.price;
  const rangeChange = endPrice - startPrice;
  const rangeChangePercent = startPrice ? (rangeChange / startPrice) * 100 : 0;
  const rising = rangeChange >= 0;
  const color = rising ? "#34d399" : "#f87171";
  const high = Math.max(...history);
  const low = Math.min(...history);

  const labels = history.map((_, index) => {
    const timestamp = timestamps[index];
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: compact ? undefined : "2-digit",
    });
  });

  const data = createStockChartData(history, labels, color, rising, compact, isLight);
  const options = createStockChartOptions(labels, compact, isLight);

  return (
    <div>
      {!compact && (
        <StockChartHeader
          high={high}
          low={low}
          rangeChange={rangeChange}
          rangeChangePercent={rangeChangePercent}
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
        />
      )}

      <div className={compact ? "h-12 w-24" : "h-64 w-full"}>
        <Line data={data} options={options} />
      </div>

      {!compact && (
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>Last {selectedRange} minute{selectedRange > 1 ? "s" : ""}</span>
          <span>Updated every 2.5 seconds · Simulated prices</span>
        </div>
      )}
    </div>
  );
}
