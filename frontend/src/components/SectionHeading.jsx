export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="font-semibold text-slate-50">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}
