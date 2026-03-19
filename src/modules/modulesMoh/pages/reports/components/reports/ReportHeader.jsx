const ReportHeader = ({
  title,
  subtitle,
  onExportPdf,
  onExportExcel,
  extraActions,
}) => {
  return (
    <div
      className="flex items-center justify-between px-5 py-4"
      style={{ background: "#065f46" }}
    >
      <div>
        <div className="text-sm font-medium text-white">{title}</div>
        {subtitle && (
          <div className="mt-1 text-xs text-green-200">{subtitle}</div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        {extraActions}

        {onExportPdf && (
          <button
            type="button"
            onClick={onExportPdf}
            className="text-xs px-3 py-1.5 rounded-md cursor-pointer text-white border border-white/30 bg-white/10"
          >
            Export PDF
          </button>
        )}

        {onExportExcel && (
          <button
            type="button"
            onClick={onExportExcel}
            className="text-xs px-3 py-1.5 rounded-md cursor-pointer text-white border border-white/30 bg-white/10"
          >
            Export Excel
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportHeader;