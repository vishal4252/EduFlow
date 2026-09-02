import { BarChart3 } from "lucide-react";

export default function LearningProgress({ progress }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="font-semibold text-slate-900">Learning Progress</h3>

        <p className="mt-1 text-xs text-slate-500">
          Track your learning activity
        </p>
      </div>

      {/* Content */}
      {progress ? (
        <div className="p-5">
          {/* We'll connect real progress data here */}
          <p className="text-sm text-slate-600">
            Progress data will be displayed here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <BarChart3 size={24} className="text-slate-400" />
          </div>

          <h4 className="mt-4 text-sm font-semibold text-slate-900">
            No progress data
          </h4>

          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Your learning progress will appear here once you start a course.
          </p>
        </div>
      )}
    </section>
  );
}
