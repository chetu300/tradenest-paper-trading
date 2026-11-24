export default function EmptyAllocationState() {
  return (
    <div className="grid h-64 place-items-center rounded-xl border border-dashed border-slate-700 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-teal-400/40 bg-teal-800/50 text-xl text-teal-200">
          ◉
        </div>
        <p className="mt-4 text-sm font-medium text-slate-300">No holdings yet</p>
        <p className="mt-1 text-xs text-slate-500">Buy a stock to see your allocation.</p>
      </div>
    </div>
  );
}
