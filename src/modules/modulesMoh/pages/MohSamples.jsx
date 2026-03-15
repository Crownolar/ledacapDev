import { useState } from "react";
import { FilterSep, BtnPrimary, BtnGhost, TH, TD } from "../utils/MohUI";
import { Pagination } from "../components/Pagination";
import { FilterBar } from "../components/FilterBar";
import { StatusBadge } from "../components/StatusBadge";

const SAMPLES = [
  { id: "SMX-00421", state: "Lagos",  lga: "Alimosho",     market: "Oshodi Market",    product: "Paracetamol 500mg", category: "Analgesics",   nafdac: "NAFD-2210", status: "VERIFIED",      price: "₦250",   origin: "Domestic", date: "2025-06-01" },
  { id: "SMX-00398", state: "Kano",   lga: "Fagge",         market: "Wambai Market",    product: "Augmentin 625mg",   category: "Antibiotics",  nafdac: "NAFD-0831", status: "VERIFIED_FAKE", price: "₦1,200", origin: "India",    date: "2025-05-30" },
  { id: "SMX-00415", state: "Rivers", lga: "Obio-Akpor",    market: "Mile 3 Market",    product: "Vitamin C 1000mg",  category: "Supplements",  nafdac: "NAFD-4421", status: "UNVERIFIED",    price: "₦400",   origin: "China",    date: "2025-05-29" },
  { id: "SMX-00407", state: "Oyo",    lga: "Ibadan North",  market: "Dugbe Market",     product: "Amoxicillin 250mg", category: "Antibiotics",  nafdac: "NAFD-1102", status: "VERIFIED",      price: "₦650",   origin: "Domestic", date: "2025-05-28" },
  { id: "SMX-00399", state: "Abuja",  lga: "Wuse",          market: "Wuse Market",      product: "Omeprazole 20mg",   category: "Gastro",       nafdac: "NAFD-3305", status: "VERIFIED",      price: "₦320",   origin: "UK",       date: "2025-05-27" },
  { id: "SMX-00388", state: "Kaduna", lga: "Kaduna North",  market: "Central Market",   product: "Ibuprofen 400mg",   category: "Analgesics",   nafdac: "NAFD-2890", status: "UNVERIFIED",    price: "₦180",   origin: "China",    date: "2025-05-26" },
  { id: "SMX-00374", state: "Enugu",  lga: "Enugu North",   market: "Coal Camp Market", product: "Metformin 500mg",   category: "Antidiabetic", nafdac: "NAFD-5501", status: "VERIFIED",      price: "₦500",   origin: "Domestic", date: "2025-05-25" },
];

const Samples = () => {
  const [state, setState] = useState("All States");
  const [lga, setLga] = useState("All LGAs");
  const [pageSize, setPageSize] = useState("10 per page");

  return (
    <div>
      <FilterBar>
        <label className="text-xs text-gray-500 whitespace-nowrap">State</label>
        <select value={state} onChange={(e) => setState(e.target.value)} className="text-xs px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-green-500">
          <option>All States</option>
          <option>Lagos</option>
          <option>Kano</option>
          <option>Oyo</option>
          <option>Abuja</option>
        </select>
        <label className="text-xs text-gray-500">LGA</label>
        <select value={lga} onChange={(e) => setLga(e.target.value)} className="text-xs px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-green-500">
          <option>All LGAs</option>
        </select>
        <FilterSep />
        <label className="text-xs text-gray-500 whitespace-nowrap">From</label>
        <input type="date" defaultValue="2025-05-01" className="text-xs px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-green-500" />
        <label className="text-xs text-gray-500 whitespace-nowrap">To</label>
        <input type="date" defaultValue="2025-06-01" className="text-xs px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-green-500" />
        <FilterSep />
        <BtnPrimary>Apply filters</BtnPrimary>
        <BtnGhost>Clear</BtnGhost>
      </FilterBar>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">All samples</div>
            <div className="text-xs text-gray-400 mt-0.5">Showing 1–7 of 48,392 samples · Read-only</div>
          </div>
          <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} className="text-xs px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-green-500">
            <option>10 per page</option>
            <option>20 per page</option>
            <option>50 per page</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                {["Sample ID","State","LGA","Market","Product name","Category","NAFDAC No.","Status","Price","Origin","Created at"].map((h) => (
                  <th key={h} className={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLES.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className={`${TD} font-mono text-xs text-green-700`}>{row.id}</td>
                  <td className={TD}>{row.state}</td>
                  <td className={TD}>{row.lga}</td>
                  <td className={TD}>{row.market}</td>
                  <td className={`${TD} font-medium`}>{row.product}</td>
                  <td className={TD}>{row.category}</td>
                  <td className={`${TD} font-mono text-xs`}>{row.nafdac}</td>
                  <td className={TD}><StatusBadge status={row.status} /></td>
                  <td className={TD}>{row.price}</td>
                  <td className={TD}>{row.origin}</td>
                  <td className={`${TD} text-gray-400`}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination showing="Showing 1–7 of 48,392 samples" totalPages={4840} />
      </div>
    </div>
  );
}

export default Samples;