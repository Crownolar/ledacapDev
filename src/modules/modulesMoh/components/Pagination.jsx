export function Pagination({ showing, totalPages = 4840 }) {
  return (
    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
      <span>{showing}</span>
      <div className="flex gap-1">
        {["‹", "1", "2", "3", "…", String(totalPages), "›"].map((p, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded flex items-center justify-center border cursor-pointer text-xs ${
              p === "1"
                ? "bg-green-700 text-white border-green-700"
                : "bg-white border-gray-200"
            }`}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}