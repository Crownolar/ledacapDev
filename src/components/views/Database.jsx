import React from "react";
import { Search, Download } from "lucide-react";
import { statesData, productTypes } from "../../utils/constants";
import { handleExcelExport } from "../../utils/helpers";

const Database = ({
  theme,
  searchTerm,
  setSearchTerm,
  filterState,
  setFilterState,
  filterProduct,
  setFilterProduct,
  filterStatus,
  setFilterStatus,
  filteredSamples,
  setSelectedSample,
}) => {
  return (
    <div className={`space-y-4 ${theme?.text}`}>
      <div
        className={`${theme?.card} rounded-lg shadow-md border ${theme?.border} p-3 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative w-full max-w-full sm:max-w-[100%]">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme?.textMuted}`}
            />
            <input
              type="text"
              placeholder="Search samples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${theme?.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base`}
            />
          </div>

          <div className="w-full max-w-full sm:max-w-[100%]">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg ${theme?.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base`}
            >
              <option value="all">All States</option>
              {Object.keys(statesData).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full max-w-full sm:max-w-[100%]">
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg ${theme?.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base`}
            >
              <option value="all">All Products</option>
              {Object.entries(productTypes).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full max-w-full sm:max-w-[100%]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg ${theme?.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base`}
            >
              <option value="all">All Status</option>
              <option value="safe">Safe</option>
              <option value="contaminated">Contaminated</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => handleExcelExport(filteredSamples)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      <div
        className={`${theme?.card} rounded-lg shadow-md border ${theme?.border} overflow-hidden w-full`}
      >
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead
              className={
                theme?.card === "bg-gray-800" ? "bg-gray-700" : "bg-gray-50"
              }
            >
              <tr>
                {[
                  "Sample ID",
                  "Product",
                  "Location",
                  "Lead Level (ppm)",
                  "Status",
                  "Date",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className={`px-4 py-3 text-left font-medium ${theme?.textMuted} uppercase tracking-wider`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSamples?.map((sample) => (
                <tr key={sample?.id} className={theme?.hover}>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {sample?.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{sample?.productName}</div>
                      <div className={`text-xs ${theme?.textMuted}`}>
                        {sample?.brand}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <div>
                        {sample?.lga}, {sample?.state}
                      </div>
                      <div className={`text-xs ${theme.textMuted}`}>
                        {sample.market}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold">
                    <span
                      className={
                        sample?.leadLevel > 1000
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {sample?.leadLevel.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        sample.status === "safe"
                          ? "bg-green-100 text-green-800"
                          : sample.status === "contaminated"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {sample?.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {sample?.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedSample(sample)}
                      className="text-emerald-500 hover:text-emerald-600 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="block sm:hidden space-y-4 p-2">
          {filteredSamples?.map((sample) => (
            <div
              key={sample?.id}
              className={`${theme?.card} border ${theme?.border} rounded-lg p-3 shadow-sm`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-500">
                  Sample ID
                </span>
                <span className="text-sm font-medium">{sample?.id}</span>
              </div>

              <div className="text-sm mb-1">
                <span className="font-semibold">Product:</span>{" "}
                {sample?.productName}{" "}
                <span className={`block text-xs ${theme?.textMuted}`}>
                  {sample?.brand}
                </span>
              </div>

              <div className="text-sm mb-1">
                <span className="font-semibold">Location:</span> {sample?.lga},{" "}
                {sample?.state}
                <div className={`text-xs ${theme?.textMuted}`}>
                  {sample?.market}
                </div>
              </div>

              <div className="text-sm mb-1">
                <span className="font-semibold">Lead Level:</span>{" "}
                <span
                  className={`font-semibold ${
                    sample?.leadLevel > 1000 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {sample?.leadLevel.toLocaleString()} ppm
                </span>
              </div>

              <div className="text-sm mb-1">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-[2px] text-xs font-semibold rounded-full ${
                    sample?.status === "safe"
                      ? "bg-green-100 text-green-800"
                      : sample.status === "contaminated"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {sample?.status.toUpperCase()}
                </span>
              </div>

              <div className="text-sm mb-1">
                <span className="font-semibold">Date:</span> {sample?.date}
              </div>

              <button
                onClick={() => setSelectedSample(sample)}
                className="mt-2 text-emerald-500 hover:text-emerald-600 text-sm font-medium"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Database;
