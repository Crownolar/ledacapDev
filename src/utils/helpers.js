import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { productTypes } from "./constants";

// Generate sample ID
export const generateSampleId = (state, lga, productType, samples) => {
  const stateCode = state.substring(0, 2).toUpperCase();
  const lgaCode = lga.substring(0, 3).toUpperCase();
  const count =
    samples?.filter((s) => s.state === state && s.lga === lga).length + 1;
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `${stateCode}-${lgaCode}-${productType}-${String(count).padStart(
    2,
    "0"
  )}-${date}`;
};

// Calculate analytics from samples
export const calculateAnalytics = (samples) => {
  const total = samples.length;
  const contaminated = samples.filter((s) => s.leadLevel > 1000).length;
  const safe = samples.filter((s) => s.leadLevel <= 1000).length;
  const pending = samples.filter((s) => s.status === "pending").length;

  const byState = samples.reduce((acc, s) => {
    acc[s.state] = (acc[s.state] || 0) + 1;
    return acc;
  }, {});

  const byProductType = samples.reduce((acc, s) => {
    const type = productTypes[s.productType];
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const registeredVsUnregistered = samples.reduce((acc, s) => {
    const key = s.registered ? "Registered" : "Unregistered";
    const contaminated = s.leadLevel > 1000 ? 1 : 0;
    if (!acc[key]) acc[key] = { total: 0, contaminated: 0 };
    acc[key].total++;
    acc[key].contaminated += contaminated;
    return acc;
  }, {});

  return {
    total,
    contaminated,
    safe,
    pending,
    byState: Object.entries(byState).map(([name, value]) => ({
      name,
      value,
    })),
    byProductType: Object.entries(byProductType).map(([name, value]) => ({
      name,
      value,
    })),
    registeredVsUnregistered: Object.entries(registeredVsUnregistered).map(
      ([name, data]) => ({
        name,
        total: data.total,
        contaminated: data.contaminated,
        contaminationRate: ((data.contaminated / data.total) * 100).toFixed(1),
      })
    ),
  };
};

// Generate PDF Report
export const generatePDFReport = (reportType, analytics, samples) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text("LEDAcap", 20, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Lead Exposure Detection & Capacity Platform", 20, 27);

  doc.setDrawColor(16, 185, 129);
  doc.line(20, 30, 190, 30);

  // Report Title
  doc.setFontSize(16);
  doc.setTextColor(0);
  let yPos = 40;

  switch (reportType) {
    case "state":
      doc.text("State Summary Report", 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPos);
      yPos += 10;

      analytics.byState.forEach((state) => {
        const stateContaminated = samples.filter(
          (s) => s.state === state.name && s.leadLevel > 1000
        ).length;
        doc.text(
          `${state.name}: ${state.value} samples (${stateContaminated} contaminated)`,
          20,
          yPos
        );
        yPos += 7;
      });
      break;

    case "contamination":
      doc.text("Contamination Analysis Report", 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.text(`Total Samples: ${analytics.total}`, 20, yPos);
      yPos += 7;
      doc.text(
        `Contaminated: ${analytics.contaminated} (${(
          (analytics.contaminated / analytics.total) *
          100
        ).toFixed(1)}%)`,
        20,
        yPos
      );
      yPos += 7;
      doc.text(
        `Safe: ${analytics.safe} (${(
          (analytics.safe / analytics.total) *
          100
        ).toFixed(1)}%)`,
        20,
        yPos
      );
      yPos += 10;

      doc.text("High-Risk Samples:", 20, yPos);
      yPos += 7;
      const highRisk = samples.filter((s) => s.leadLevel > 5000).slice(0, 10);
      highRisk.forEach((s) => {
        doc.setFontSize(9);
        doc.text(`${s.id}: ${s.productName} - ${s.leadLevel} ppm`, 25, yPos);
        yPos += 6;
      });
      break;

    case "product":
      doc.text("Product Type Report", 20, yPos);
      yPos += 10;
      analytics.byProductType.forEach((pt) => {
        doc.setFontSize(10);
        doc.text(`${pt.name}: ${pt.value} samples`, 20, yPos);
        yPos += 7;
      });
      break;

    case "risk":
      doc.text("Risk Assessment Report", 20, yPos);
      yPos += 10;
      doc.setFontSize(10);

      analytics.registeredVsUnregistered.forEach((category) => {
        doc.text(`${category.name} Products:`, 20, yPos);
        yPos += 7;
        doc.text(`  Total: ${category.total}`, 25, yPos);
        yPos += 6;
        doc.text(`  Contaminated: ${category.contaminated}`, 25, yPos);
        yPos += 6;
        doc.text(
          `  Contamination Rate: ${category.contaminationRate}%`,
          25,
          yPos
        );
        yPos += 10;
      });
      break;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("LEDAcap © 2025 - Confidential Report", 20, 280);

  doc.save(
    `LEDAcap_${reportType}_Report_${
      new Date().toISOString().split("T")[0]
    }.pdf`
  );
};

// Export to Excel
export const handleExcelExport = (filteredSamples) => {
  const exportData = filteredSamples.map((s) => ({
    "Sample ID": s.id,
    State: s.state,
    LGA: s.lga,
    "Product Type": productTypes[s.productType],
    "Product Name": s.productName,
    Brand: s.brand,
    Registered: s.registered ? "Yes" : "No",
    Market: s.market,
    "Vendor Type": s.vendorType,
    "Price (₦)": s.price,
    "Lead Level (ppm)": s.leadLevel,
    Status: s.status.toUpperCase(),
    Date: s.date,
    Latitude: s.coordinates.lat,
    Longitude: s.coordinates.lng,
    "Collected By": s.collectedBy,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Samples");
  XLSX.writeFile(
    wb,
    `LEDAcap_Samples_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};

// Import from Excel
export const handleExcelImport = (file, currentUser, samples, callback) => {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (evt) => {
    try {
      const bstr = evt.target?.result;
      if (!bstr) {
        alert("Failed to read file.");
        return;
      }

      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws);

      const importedSamples = data.map((row) => ({
        id:
          row.id ||
          generateSampleId(row.state, row.lga, row.productType, samples),
        state: String(row.state || ""),
        lga: String(row.lga || ""),
        productType: row.productType || "A",
        productName: String(row.productName || ""),
        brand: String(row.brand || "N/A"),
        registered: row.registered === "Yes" || row.registered === true,
        market: String(row.market || ""),
        vendorType: String(row.vendorType || ""),
        price: parseFloat(row.price) || 0,
        leadLevel: parseFloat(row.leadLevel) || 0,
        status: String(row.status || "pending"),
        date: String(row.date || new Date().toISOString().split("T")[0]),
        coordinates: {
          lat: parseFloat(row.latitude) || 0,
          lng: parseFloat(row.longitude) || 0,
        },
        productPhoto: null,
        vendorPhoto: null,
        collectedBy: currentUser?.name || "Unknown",
      }));

      callback(importedSamples);
      alert(`Successfully imported ${importedSamples.length} samples!`);
    } catch (error) {
      alert("Error importing Excel file. Please check the format.");
      console.error(error);
    }
  };

  reader.readAsBinaryString(file);
};

// Filter samples
export const filterSamples = (
  samples,
  searchTerm,
  filterState,
  filterProduct,
  filterStatus
) => {
  return samples.filter((sample) => {
    const matchesSearch =
      sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.market.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = filterState === "all" || sample.state === filterState;
    const matchesProduct =
      filterProduct === "all" || sample.productType === filterProduct;
    const matchesStatus =
      filterStatus === "all" || sample.status === filterStatus;

    return matchesSearch && matchesState && matchesProduct && matchesStatus;
  });
};
