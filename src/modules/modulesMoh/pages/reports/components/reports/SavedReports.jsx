import { TypeBadge } from "../../../../components/TypeBadge";

const SAVED_REPORTS = [
  { title: "State summary — Lagos", sub: "Generated 10 Jun 2025", type: "State summary" },
  { title: "Risk assessment — Q1 2025", sub: "Generated 3 Apr 2025", type: "Risk assessment" },
  { title: "Contamination analysis — Kano, Rivers", sub: "Generated 21 Mar 2025", type: "Contamination" },
];

const SavedReports = () => {
  return (
    <div className="mt-5">
      <div className="text-sm font-medium text-gray-900 mb-3">Saved reports</div>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {SAVED_REPORTS.map((r) => (
          <div key={r.title} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm font-medium text-gray-900">{r.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{r.sub}</div>
            </div>
            <div className="flex items-center gap-2">
              <TypeBadge type={r.type} />
              <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-md bg-white text-gray-500 hover:border-green-400 hover:text-green-700 cursor-pointer">
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedReports;