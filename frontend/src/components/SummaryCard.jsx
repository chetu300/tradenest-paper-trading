import { formatCurrency } from "../utils/formatCurrency.js";

export default function SummaryCard({ label, value, detail, accent }) {
  let valueStyle = "text-slate-50";
  if (accent === "positive") valueStyle = "text-emerald-400";
  if (accent === "negative") valueStyle = "text-red-400";

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-800/90 p-4 shadow-lg shadow-slate-950/10 sm:p-5">
      <p className="text-xs font-medium text-slate-400 sm:text-sm">{label}</p>
      <p className={`mt-2 text-lg font-bold sm:text-xl ${valueStyle}`}>
        {typeof value === "number" ? formatCurrency(value) : value}
      </p>
      {detail && (
        <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">{detail}</p>
      )}
    </div>
  );
}
