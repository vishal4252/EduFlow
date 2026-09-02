import { ArrowUpRight } from "lucide-react";

export default function StatsCard({
  title,
  value = "--",
  description,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={20} />
        </div>
      </div>

      {description && (
        <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
          <ArrowUpRight size={14} />
          <span>{description}</span>
        </div>
      )}
    </div>
  );
}
