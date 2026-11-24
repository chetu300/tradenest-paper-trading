import { formatCurrency } from "./formatCurrency.js";

export function createStockChartData(history, labels, color, rising, compact, isLight) {
  return {
    labels,
    datasets: [
      {
        data: history,
        borderColor: color,
        backgroundColor(context) {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) {
            return rising
              ? "rgba(52, 211, 153, 0.12)"
              : "rgba(248, 113, 113, 0.12)";
          }

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(
            0,
            rising ? "rgba(52, 211, 153, 0.25)" : "rgba(248, 113, 113, 0.25)",
          );
          gradient.addColorStop(1, "rgba(17, 24, 39, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: compact ? 0 : 4,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: isLight ? "#ffffff" : "#111827",
        pointHoverBorderWidth: 2,
        borderWidth: compact ? 1.5 : 2.5,
      },
    ],
  };
}

export function createStockChartOptions(labels, compact, isLight) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: !compact,
        backgroundColor: isLight ? "#ffffff" : "#0B1220",
        borderColor: isLight ? "#cbd5e1" : "#334155",
        borderWidth: 1,
        titleColor: isLight ? "#475569" : "#94A3B8",
        bodyColor: isLight ? "#0f172a" : "#F8FAFC",
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (items) => labels[items[0]?.dataIndex] || "",
          label: (item) => formatCurrency(item.raw),
        },
      },
    },
    scales: {
      x: {
        display: !compact,
        border: { display: false },
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 10 }, maxTicksLimit: 5 },
      },
      y: {
        display: !compact,
        border: { display: false },
        position: "right",
        grace: "12%",
        grid: {
          color: isLight ? "rgba(100, 116, 139, 0.18)" : "rgba(148, 163, 184, 0.10)",
          drawTicks: false,
        },
        ticks: {
          color: "#64748B",
          font: { size: 10 },
          maxTicksLimit: 5,
          callback(value) {
            return `₹${Number(value).toLocaleString("en-IN")}`;
          },
        },
      },
    },
  };
}
