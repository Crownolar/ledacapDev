import { useEffect, useRef, useState } from "react";
import { FilterBar } from "../components/FilterBar";
import { FilterSep, BtnPrimary, TH, TD } from "../utils/MohUI";
import { MetricCard } from "../components/MetricCard";
import { Pagination } from "../components/Pagination";
import { SectionLabel } from "../components/SectionLabel";
import {  WhiteCard } from "../components/WhiteCard";
import { StatusBadge } from "../components/StatusBadge";

const METRICS = [
  { label: "Total Verifications", value: "48,392", sub: "All time",  color: "text-gray-900"  },
  { label: "Verified",            value: "31,745", sub: "65.6%",     color: "text-green-700" },
  { label: "Failed",              value: "4,210",  sub: "8.7%",      color: "text-red-600"   },
  { label: "Pending",             value: "12,437", sub: "25.7%",     color: "text-amber-600" },
];

const STATUS_TABS = ["All", "Verified", "Failed", "Pending"];

const LOGS = [
  { id: "SMX-00421", product: "Paracetamol 500mg",  brand: "HealthPlus",  nafdac: "NAFD-2210", state: "Lagos",  lga: "Alimosho",     category: "Analgesics",  status: "VERIFIED",      date: "2025-06-01" },
  { id: "SMX-00398", product: "Augmentin 625mg",    brand: "GSK Nigeria", nafdac: "NAFD-0831", state: "Kano",   lga: "Fagge",         category: "Antibiotics", status: "VERIFIED_FAKE", date: "2025-05-30" },
  { id: "SMX-00415", product: "Vitamin C 1000mg",   brand: "NovaCare",    nafdac: "NAFD-4421", state: "Rivers", lga: "Obio-Akpor",    category: "Supplements", status: "UNVERIFIED",    date: "2025-05-29" },
  { id: "SMX-00407", product: "Amoxicillin 250mg",  brand: "PharmaTrust", nafdac: "NAFD-1102", state: "Oyo",    lga: "Ibadan North",  category: "Antibiotics", status: "VERIFIED",      date: "2025-05-28" },
  { id: "SMX-00399", product: "Omeprazole 20mg",    brand: "RxPharma",    nafdac: "NAFD-3305", state: "Abuja",  lga: "Wuse",          category: "Gastro",      status: "VERIFIED",      date: "2025-05-27" },
  { id: "SMX-00388", product: "Ibuprofen 400mg",    brand: "Emzor",       nafdac: "NAFD-2890", state: "Kaduna", lga: "Kaduna N.",     category: "Analgesics",  status: "UNVERIFIED",    date: "2025-05-26" },
];

 const Verification = () => {
  const chartRef = useRef(null);
  const chartInst = useRef(null);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (!window.Chart || !chartRef.current) return;
    chartInst.current?.destroy();
    chartInst.current = new window.Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Jun 1","Jun 2","Jun 3","Jun 4","Jun 5","Jun 6","Jun 7","Jun 8","Jun 9","Jun 10"],
        datasets: [
          { label: "Verified", data: [412,389,445,520,398,461,503,489,412,531], backgroundColor: "#059669" },
          { label: "Failed",   data: [42,38,55,61,49,52,48,63,44,57],           backgroundColor: "#dc2626" },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { font: { size: 11 }, padding: 10 } } },
        scales: { x: { stacked: false, grid: { display: false } }, y: { grid: { color: "#f3f4f6" } } },
      },
    });
    return () => chartInst.current?.destroy();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {METRICS.map((m) => <MetricCard key={m.label} {...m} />)}
      </div>

      <WhiteCard className="mb-4">
        <SectionLabel>Daily verifications — June 2025</SectionLabel>
        <div className="relative w-full" style={{ height: 160 }}>
          <canvas ref={chartRef} />
        </div>
      </WhiteCard>

      <FilterBar>
        <label className="text-xs text-gray-500 whitespace-nowrap">From</label>
        <input type="date" defaultValue="2025-05-01" className="text-xs px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-green-500" />
        <label className="text-xs text-gray-500 whitespace-nowrap">To</label>
        <input type="date" defaultValue="2025-06-01" className="text-xs px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-green-500" />
        <FilterSep />
        <label className="text-xs text-gray-500">State</label>
        <select className="text-xs px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-green-500">
          <option>All States</option>
          <option>Lagos</option>
          <option>Kano</option>
        </select>
        <BtnPrimary>Apply</BtnPrimary>
      </FilterBar>

      {/* Status tabs */}
      <div className="flex gap-1 mb-4">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium cursor-pointer border ${
              activeTab === t
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Verification log</div>
            <div className="text-xs text-gray-400 mt-0.5">Read-only · No verify/re-verify actions</div>
          </div>
          <select className="text-xs px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-green-500">
            <option>10 per page</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                {["Sample ID","Product","Brand","NAFDAC No.","State","LGA","Category","Status","Created at"].map((h) => (
                  <th key={h} className={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOGS.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className={`${TD} font-mono text-xs text-green-700`}>{row.id}</td>
                  <td className={`${TD} font-medium`}>{row.product}</td>
                  <td className={TD}>{row.brand}</td>
                  <td className={`${TD} font-mono text-xs`}>{row.nafdac}</td>
                  <td className={TD}>{row.state}</td>
                  <td className={TD}>{row.lga}</td>
                  <td className={TD}>{row.category}</td>
                  <td className={TD}><StatusBadge status={row.status} /></td>
                  <td className={`${TD} text-gray-400`}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination showing="Showing 1–6 of 48,392" totalPages={4840} />
      </div>
    </div>
  );
}

export default Verification;