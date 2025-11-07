import { X, AlertTriangle } from "lucide-react";
import { productTypes } from "../../utils/constants";

const SampleDetailModal = ({ theme, sample, onClose }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50${theme.text}`}
    >
      <div
        className={`${theme.card} rounded-xl shadow-2xl w-full max-w-3xl max-h-[100vh] flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`p-3 sm:p-4 md:p-6 border-b ${theme.border} flex items-center justify-between`}
        >
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold break-words leading-tight">
              {sample?.productName}
            </h2>
            <p
              className={`text-xs sm:text-sm ${theme.textMuted} mt-1 truncate`}
            >
              {sample?.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${theme.hover} flex-shrink-0`}
            aria-label="Close"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          {/* Body */}
          <div className="p-3 sm:p-4 md:p-6 space-y-6 bg-transparent">
            {/* Information Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Sample Information */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 text-emerald-500">
                  Sample Information
                </h3>
                <div className="space-y-2 text-sm sm:text-base">
                  {[
                    ["Product Type:", productTypes[sample?.productType]],
                    ["Brand:", sample?.brand],
                    [
                      "Registered:",
                      sample?.registered ? "Yes (NAFDAC/SON)" : "No",
                    ],
                    ["Price:", `₦${sample?.price?.toLocaleString()}`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm"
                    >
                      <span className={`${theme.textMuted} min-w-[110px]`}>
                        {label}
                      </span>
                      <span className="font-medium text-right break-words">
                        {value}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm">
                    <span className={theme.textMuted}>Lead Level:</span>
                    <span
                      className={`font-bold ${
                        sample?.leadLevel > 1000
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {sample?.leadLevel?.toLocaleString()} ppm
                    </span>
                  </div>

                  <div className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm">
                    <span className={theme.textMuted}>Status:</span>
                    <span
                      className={`px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
                        sample?.status === "safe"
                          ? "bg-green-100 text-green-800"
                          : sample?.status === "contaminated"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {sample?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 text-emerald-500">
                  Location Details
                </h3>
                <div className="space-y-2 text-sm sm:text-base">
                  {[
                    ["State:", sample?.state],
                    ["LGA:", sample?.lga],
                    ["Market:", sample?.market],
                    ["Vendor Type:", sample?.vendorType],
                    ["Collection Date:", sample?.date],
                    ["Collected By:", sample?.collectedBy],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm"
                    >
                      <span className={`${theme.textMuted} min-w-[110px]`}>
                        {label}
                      </span>
                      <span className="font-medium text-right break-words">
                        {value}
                      </span>
                    </div>
                  ))}

                  {sample?.coordinates?.lat && sample?.coordinates?.lng && (
                    <div className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm">
                      <span className={theme.textMuted}>GPS:</span>
                      <span className="font-medium text-xs text-right break-words">
                        {sample?.coordinates?.lat}, {sample?.coordinates?.lng}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Photos */}
            {(sample?.productPhoto || sample?.vendorPhoto) && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 text-emerald-500">
                  Documentation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {sample?.productPhoto && (
                    <div>
                      <p
                        className={`text-xs sm:text-sm ${theme.textMuted} mb-2`}
                      >
                        Product Photo
                      </p>
                      <img
                        src={sample?.productPhoto}
                        alt="Product"
                        className="w-full h-44 sm:h-56 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {sample?.vendorPhoto && (
                    <div>
                      <p
                        className={`text-xs sm:text-sm ${theme.textMuted} mb-2`}
                      >
                        Vendor Stall Photo
                      </p>
                      <img
                        src={sample?.vendorPhoto}
                        alt="Vendor"
                        className="w-full h-44 sm:h-56 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Warning Box */}
            {sample?.leadLevel > 1000 && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1 text-sm sm:text-base">
                      Contaminated Product Alert
                    </h4>
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                      This product exceeds safe lead levels (1000 ppm).
                      Immediate action required. Do not use or distribute this
                      product.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDetailModal;
