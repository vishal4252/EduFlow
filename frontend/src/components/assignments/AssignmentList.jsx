import { ClipboardList } from "lucide-react";

export default function AssignmentList({ assignments, loading, error }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <ClipboardList size={24} className="text-slate-400" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No assignments
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Assignments will appear here when they are available.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="divide-y divide-slate-100">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              {assignment.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {assignment.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>
                Course:{" "}
                <span className="font-medium text-slate-700">
                  {assignment.course?.title}
                </span>
              </span>

              <span>
                Instructor:{" "}
                <span className="font-medium text-slate-700">
                  {assignment.instructor?.username}
                </span>
              </span>

              <span>
                Due:{" "}
                <span className="font-medium text-slate-700">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
