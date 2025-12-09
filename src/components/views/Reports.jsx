import React, { useEffect, useState } from "react";
import { FileText, BarChart3, Package, AlertTriangle, Loader, Download, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSamples } from "../../redux/slice/samplesSlice";
import { useTheme } from "../../hooks/useTheme";
import api from "../../utils/api";

const Reports = ({ theme: propTheme, samples: propSamples }) => {
  const dispatch = useDispatch();
  const { theme: hookTheme } = useTheme();
  const { samples: reduxSamples } = useSelector((state) => state.samples);

  // Use props if provided, otherwise fall back to Redux
  const theme = propTheme || hookTheme;
  const samples = propSamples || reduxSamples || [];

  // State management
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [states, setStates] = useState([]);
  const [productTypes] = useState([
    { key: "TIRO", label: "TIRO" },
    { key: "TIRO_RGSTD", label: "TIRO RGSTD" },
    { key: "CULTURAL_POWDER", label: "Cultural Powder" },
    { key: "LIPSTICK", label: "Lipstick" },
    { key: "HAIR_DYE", label: "Hair Dye" },
    { key: "EYE_PENCIL", label: "Eye Pencil" },
    { key: "NAIL_POLISH", label: "Nail Polish" },
    { key: "SKIN_LOTION", label: "Skin Lotion" },
  ]);
  const [reportFilters, setReportFilters] = useState({
    state: "",
    states: [],
    productTypes: [],
    dateFrom: "",
    dateTo: "",
    minLeadLevel: 10,
  });

  // Fetch samples and states on mount if not provided via props
  useEffect(() => {
    if (!propSamples) {
      dispatch(fetchSamples());
    }
    fetchStates();
  }, [dispatch, propSamples]);

  const fetchStates = async () => {
    try {
      const response = await api.get("/samples/states/all");
      setStates(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch states:", err);
    }
  };

  const generateReport = async (reportType) => {
    setLoading(true);
    try {
      const endpoint = `/reports/generate/${reportType}`;
      const payload = {
        state: reportFilters.state,
        states: reportFilters.states.length > 0 ? reportFilters.states : undefined,
        productTypes: reportFilters.productTypes.length > 0 ? reportFilters.productTypes : undefined,
        dateFrom: reportFilters.dateFrom || undefined,
        dateTo: reportFilters.dateTo || undefined,
        minLeadLevel: reportFilters.minLeadLevel || 10,
      };

      const response = await api.post(endpoint, payload, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${reportType}-report-${new Date().toISOString().split("T")[0]}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("Report generated and downloaded successfully!");
      setSelectedReport(null);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert(
        error.response?.data?.message || "Failed to generate report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const ReportModal = ({ report, onClose }) => {
    const [filters, setFilters] = useState(reportFilters);

    const handleSubmit = async () => {
      setReportFilters(filters);
      await generateReport(report.type);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div
          className={`${theme?.card} rounded-lg shadow-xl max-w-md w-full border ${theme?.border}`}
        >
          <div className={`p-6 border-b ${theme?.border} flex items-center justify-between`}>
            <h2 className="text-lg font-bold">{report.title}</h2>
            <button onClick={onClose} className={`p-2 rounded-lg ${theme?.hover}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* State Filter (for State Summary and Product Type) */}
            {(report.type === "state-summary" || report.type === "product-type") && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme?.text}`}>
                  Select State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${theme?.input} focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value="">-- Select a state --</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Multiple States Filter (for Contamination Analysis) */}
            {report.type === "contamination-analysis" && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme?.text}`}>
                  Select States (optional)
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {states.map((state) => (
                    <label key={state.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.states.includes(state.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              states: [...filters.states, state.name],
                            });
                          } else {
                            setFilters({
                              ...filters,
                              states: filters.states.filter((s) => s !== state.name),
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{state.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Product Types Filter */}
            {report.type === "contamination-analysis" && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme?.text}`}>
                  Select Product Types (optional)
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {productTypes.map((type) => (
                    <label key={type.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.productTypes.includes(type.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              productTypes: [...filters.productTypes, type.key],
                            });
                          } else {
                            setFilters({
                              ...filters,
                              productTypes: filters.productTypes.filter((p) => p !== type.key),
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme?.text}`}>
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${theme?.input} focus:ring-2 focus:ring-emerald-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme?.text}`}>
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${theme?.input} focus:ring-2 focus:ring-emerald-500`}
                />
              </div>
            </div>

            {/* Min Lead Level for Risk Assessment */}
            {report.type === "risk-assessment" && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme?.text}`}>
                  Minimum Contamination Level (ppm)
                </label>
                <input
                  type="number"
                  value={filters.minLeadLevel}
                  onChange={(e) => setFilters({ ...filters, minLeadLevel: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${theme?.input} focus:ring-2 focus:ring-emerald-500`}
                  min="1"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Generate & Download
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className={`flex-1 border rounded-lg font-medium ${theme?.hover}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const reportOptions = [
    {
      type: "state-summary",
      title: "State Summary Report",
      description: "Comprehensive analysis by state",
      icon: FileText,
      color: "border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    },
    {
      type: "contamination-analysis",
      title: "Contamination Analysis",
      description: "Detailed contamination statistics and trends",
      icon: BarChart3,
      color: "border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    },
    {
      type: "product-type",
      title: "Product Type Report",
      description: "Analysis by product category",
      icon: Package,
      color: "border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20",
    },
    {
      type: "risk-assessment",
      title: "Risk Assessment",
      description: "High-risk products and areas",
      icon: AlertTriangle,
      color: "border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20",
    },
  ];

  return (
    <div
      className={`${theme?.card} ${theme?.text} rounded-lg shadow-md p-6 border ${theme?.border}`}
    >
      <h2 className="text-2xl font-semibold mb-6">Generate Reports</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportOptions.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.type}
                onClick={() => setSelectedReport(report)}
                className={`p-6 border-2 ${report.color} rounded-lg transition-colors text-left`}
              >
                <Icon className={`w-8 h-8 mb-2 ${report.color.split(" ")[1]}`} />
                <h3 className="font-semibold mb-1">{report.title}</h3>
                <p className={`text-sm ${theme?.textMuted}`}>{report.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
};

export default Reports;
