import { useEffect, useRef } from "react";
import { MetricCard } from "../components/MetricCard";
import { WhiteCard } from "../components/WhiteCard";
import { SectionLabel } from "../components/SectionLabel";

const HOTSPOTS = [
  { name: "Lagos",  width: "92%", score: "9.2", color: "text-red-600"   },
  { name: "Kano",   width: "79%", score: "7.9", color: "text-red-600"   },
  { name: "Rivers", width: "66%", score: "6.6", color: "text-amber-600" },
  { name: "Oyo",    width: "51%", score: "5.1", color: "text-amber-600" },
  { name: "Kaduna", width: "43%", score: "4.3", color: "text-green-600" },
];

const METRICS = [
  { label: "Total Samples",        value: "48,392", sub: "Nationwide · last 30 days", color: "text-gray-900",  page: "samples"      },
  { label: "Verified Products",    value: "31,745", sub: "65.6% of total",            color: "text-green-700", page: "verification" },
  { label: "Failed Verifications", value: "4,210",  sub: "8.7% failure rate",         color: "text-red-600",   page: "verification" },
  { label: "Pending",              value: "12,437", sub: "Awaiting NAFDAC check",     color: "text-amber-600", page: "verification" },
];

 const MohDashboard =({ onNavigate }) => {
  const donutRef = useRef(null);
  const trendRef = useRef(null);
  const donutChart = useRef(null);
  const trendChart = useRef(null);

  useEffect(() => {
    if (!window.Chart) return;

    if (donutRef.current) {
      donutChart.current?.destroy();
      donutChart.current = new window.Chart(donutRef.current, {
        type: "doughnut",
        data: {
          labels: ["Verified", "Failed", "Pending"],
          datasets: [{ data: [31745, 4210, 12437], backgroundColor: ["#059669", "#dc2626", "#d97706"], borderWidth: 2, borderColor: "#fff" }],
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: "65%", plugins: { legend: { position: "bottom", labels: { font: { size: 11 }, padding: 12 } } } },
      });
    }

    if (trendRef.current) {
      trendChart.current?.destroy();
      trendChart.current = new window.Chart(trendRef.current, {
        type: "line",
        data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets: [
            { label: "Verified", data: [2100,2400,2800,3100,2900,3300,3200,3600,3400,3800,3500,3645], borderColor: "#059669", tension: 0.4, fill: false, pointRadius: 3 },
            { label: "Failed",   data: [320,280,350,390,310,420,400,450,380,480,410,420],             borderColor: "#dc2626", tension: 0.4, fill: false, pointRadius: 3 },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { font: { size: 11 }, padding: 12 } } }, scales: { y: { grid: { color: "#f3f4f6" } }, x: { grid: { display: false } } } },
      });
    }

    return () => { donutChart.current?.destroy(); trendChart.current?.destroy(); };
  }, []);

  return (
    <div>
      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {METRICS.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} sub={m.sub} color={m.color} clickable onClick={() => onNavigate(m.page)} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Donut */}
        <WhiteCard>
          <SectionLabel>Verification status breakdown</SectionLabel>
          <div className="relative w-full" style={{ height: 220 }}>
            <canvas ref={donutRef} />
          </div>
        </WhiteCard>

        {/* Hotspots */}
        <WhiteCard>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Top risk hotspots</SectionLabel>
            <button onClick={() => onNavigate("contamination")} className="text-xs text-green-600 cursor-pointer font-medium bg-transparent border-0 p-0">
              View all →
            </button>
          </div>
          {HOTSPOTS.map((h) => (
            <div key={h.name} className="flex items-center gap-2 mb-2 text-xs">
              <div className="w-20 font-medium text-gray-900 flex-shrink-0">{h.name}</div>
              <div className="flex-1 h-2 bg-green-50 rounded overflow-hidden">
                <div className="h-2 bg-green-500 rounded" style={{ width: h.width }} />
              </div>
              <div className={`w-8 text-right font-medium ${h.color}`}>{h.score}</div>
            </div>
          ))}
        </WhiteCard>
      </div>

      {/* Trend chart */}
      <WhiteCard>
        <SectionLabel>Monthly verification trend — 2025</SectionLabel>
        <div className="relative w-full" style={{ height: 180 }}>
          <canvas ref={trendRef} />
        </div>
      </WhiteCard>
    </div>
  );
}

export default MohDashboard;