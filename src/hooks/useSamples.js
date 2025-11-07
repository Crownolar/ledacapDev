import { useState, useMemo } from "react";
import { initialSamples } from "../utils/constants";
import { calculateAnalytics, filterSamples, generateSampleId } from "../utils/helpers";

export const useSamples = (currentUser) => {
  const [samples, setSamples] = useState(initialSamples);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSample, setSelectedSample] = useState(null);

  const analytics = useMemo(() => calculateAnalytics(samples), [samples]);

  const filteredSamples = useMemo(
    () =>
      filterSamples(
        samples,
        searchTerm,
        filterState,
        filterProduct,
        filterStatus
      ),
    [samples, searchTerm, filterState, filterProduct, filterStatus]
  );

  const addSample = (formData) => {
    const sampleId = generateSampleId(
      formData.state,
      formData.lga,
      formData.productType,
      samples
    );

    const newSample = {
      id: sampleId,
      state: formData.state,
      lga: formData.lga,
      productType: formData.productType,
      productName: formData.productName,
      brand: formData.brand,
      registered: formData.registered,
      market: formData.market,
      vendorType: formData.vendorType,
      price: parseFloat(formData.price) || 0,
      leadLevel: 0,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      coordinates: {
        lat: parseFloat(formData.coordinates.lat) || 0,
        lng: parseFloat(formData.coordinates.lng) || 0,
      },
      productPhoto: formData.productPhoto || null,
      vendorPhoto: formData.vendorPhoto || null,
      collectedBy: currentUser?.name || "Unknown",
    };

    setSamples((prev) => [...prev, newSample]);
  };

  const importSamples = (importedSamples) => {
    setSamples((prev) => [...prev, ...importedSamples]);
  };

  return {
    samples,
    setSamples,
    searchTerm,
    setSearchTerm,
    filterState,
    setFilterState,
    filterProduct,
    setFilterProduct,
    filterStatus,
    setFilterStatus,
    selectedSample,
    setSelectedSample,
    analytics,
    filteredSamples,
    addSample,
    importSamples,
  };
};
