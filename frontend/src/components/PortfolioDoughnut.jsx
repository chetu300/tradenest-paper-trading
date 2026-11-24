import { ArcElement, Chart as ChartJS, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { formatCurrency } from "../utils/formatCurrency.js";
import { portfolioChartColors } from "../data/chartColors.js";
import { useTheme } from "../contexts/useTheme.js";

ChartJS.register(ArcElement, Tooltip);

export default function PortfolioDoughnut({
  holdings,
  total,
  highlightedHolding,
  onHover,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const data = {
    labels: holdings.map((holding) => holding.symbol),
    datasets: [
      {
        data: holdings.map((holding) => holding.currentValue),
        backgroundColor: holdings.map(
          (_, index) => portfolioChartColors[index % portfolioChartColors.length],
        ),
        borderColor: isLight ? "#ffffff" : "#1E293B",
        borderWidth: 3,
        hoverOffset: 10,
        spacing: 3,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "76%",
    rotation: -90,
    animation: { duration: 700 },
    onHover(_event, activeElements) {
      onHover(activeElements[0]?.index ?? null);
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isLight ? "#ffffff" : "#0B1220",
        borderColor: isLight ? "#cbd5e1" : "#334155",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label(context) {
            const percent = total ? (context.raw / total) * 100 : 0;
            return ` ${formatCurrency(context.raw)} · ${percent.toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="relative mx-auto h-48 w-48">
      <Doughnut data={data} options={options} />
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            {highlightedHolding?.symbol || "Market value"}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-100">
            {formatCurrency(highlightedHolding?.currentValue ?? total)}
          </p>
          {highlightedHolding && (
            <p className="mt-1 text-[10px] text-slate-400">
              {((highlightedHolding.currentValue / total) * 100).toFixed(1)}% of portfolio
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
