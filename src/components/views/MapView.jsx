import React from "react";
import { MapPin, MapPinned } from "lucide-react";

const MapView = ({ theme, samples = [] }) => {
  return (
    <div
      className={`${theme.card} ${theme.text} rounded-lg shadow-md p-6 border ${theme.border}`}
    >
      <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
      <div className="space-y-4">
        {samples
          .filter((s) => s.coordinates.lat && s.coordinates.lng)
          .map((sample) => (
            <div
              key={sample.id}
              className={`p-4 border ${theme.border} rounded-lg flex items-start gap-4`}
            >
              <MapPinned
                className={`w-6 h-6 mt-1 ${
                  sample.leadLevel > 1000 ? "text-red-500" : "text-green-500"
                }`}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{sample.productName}</h3>
                    <p className={`text-sm ${theme.textMuted}`}>
                      {sample.market}, {sample.lga}, {sample.state}
                    </p>
                    <p className={`text-xs ${theme.textMuted} mt-1`}>
                      Coordinates: {sample.coordinates.lat},{" "}
                      {sample.coordinates.lng}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      sample.leadLevel > 1000
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {sample.leadLevel} ppm
                  </span>
                </div>
              </div>
            </div>
          ))}

        {samples.filter((s) => s.coordinates.lat && s.coordinates.lng)
          .length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className={theme.textMuted}>
              No samples with GPS coordinates yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
