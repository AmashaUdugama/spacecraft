import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getSummary } from "../api/spacecraft";
import { useCountUp } from "../hooks/useCountUp";
import ComfortRing from "../components/ComfortRing";
import LoadingState from "../components/LoadingState";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CHART_COLORS = ["#c9603f", "#2f8f83", "#c79a56", "#a85275", "#4a5b8c", "#7c9885"];

function toChartData(breakdown, label) {
  const labels = Object.keys(breakdown);
  const values = Object.values(breakdown);
  return {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderRadius: 3,
      },
    ],
  };
}

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  animation: { duration: 700, easing: "easeOutCubic" },
  scales: {
    y: { beginAtZero: true, ticks: { font: { family: "IBM Plex Mono", size: 11 } } },
    x: { ticks: { font: { family: "Inter", size: 11 } } },
  },
};

function CountStat({ label, value, suffix = "" }) {
  const animated = useCountUp(value);
  const display = Number.isInteger(value) ? Math.round(animated) : animated.toFixed(1);
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value" data-counting="true">{display}{suffix}</span>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSummary();
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Could not load dashboard.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingState label="Loading dashboard..." />;
  if (error) return <div className="page"><div className="error-banner">{error}</div></div>;
  if (!summary || summary.total_uploads_analyzed === 0) {
    return (
      <div className="page">
        <h1>Dashboard</h1>
        <p className="subtitle">No analyses yet — every insight here builds from rooms you upload.</p>
      </div>
    );
  }

  const roomTypeCount = Object.keys(summary.room_type_breakdown).length;
  const styleCount = Object.keys(summary.style_breakdown).length;
  const topRoom = Object.entries(summary.room_type_breakdown).sort((a, b) => b[1] - a[1])[0];
  const topStyle = Object.entries(summary.style_breakdown).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="subtitle">A running record of every room SpaceCraft has analyzed for you.</p>

      <div className="stat-grid">
        <CountStat label="Rooms analyzed" value={summary.total_uploads_analyzed} />
        <div className="stat-card comfort-ring-card">
          <span className="stat-label">Avg. comfort score</span>
          <ComfortRing value={summary.average_comfort_score} color="#c9603f" />
        </div>
        <CountStat label="Room types seen" value={roomTypeCount} />
        <CountStat label="Styles detected" value={styleCount} />
        <div className="stat-card">
          <span className="stat-label">Most common room</span>
          <span className="stat-value">{topRoom ? topRoom[0].replace("_", " ") : "—"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Most common style</span>
          <span className="stat-value">{topStyle ? topStyle[0] : "—"}</span>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Room types analyzed</h3>
          <Bar data={toChartData(summary.room_type_breakdown, "Rooms")} options={chartOptions} />
        </div>
        <div className="chart-card">
          <h3>Styles detected</h3>
          <Bar data={toChartData(summary.style_breakdown, "Styles")} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
// // // import { useEffect, useState } from "react";
// // // import { Bar } from "react-chartjs-2";
// // // import {
// // //   Chart as ChartJS,
// // //   CategoryScale,
// // //   LinearScale,
// // //   BarElement,
// // //   Tooltip,
// // //   Legend,
// // // } from "chart.js";
// // // import { getSummary } from "../api/spacecraft";

// // // ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// // // function toChartData(breakdown, label, color) {
// // //   const labels = Object.keys(breakdown);
// // //   const values = Object.values(breakdown);
// // //   return {
// // //     labels,
// // //     datasets: [{ label, data: values, backgroundColor: color }],
// // //   };
// // // }

// // // export default function Dashboard() {
// // //   const [summary, setSummary] = useState(null);
// // //   const [error, setError] = useState("");
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     async function load() {
// // //       try {
// // //         const data = await getSummary();
// // //         setSummary(data);
// // //       } catch (err) {
// // //         setError(err.response?.data?.detail || "Could not load dashboard.");
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }
// // //     load();
// // //   }, []);

// // //   if (loading) return <div className="page">Loading dashboard...</div>;
// // //   if (error) return <div className="page"><div className="error-banner">{error}</div></div>;
// // //   if (!summary || summary.total_uploads_analyzed === 0) {
// // //     return (
// // //       <div className="page">
// // //         <h1>Dashboard</h1>
// // //         <p>No analyses yet. Upload a room photo to see your stats here.</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="page">
// // //       <h1>Dashboard</h1>

// // //       <div className="stat-grid">
// // //         <div className="stat-card">
// // //           <span className="stat-label">Total rooms analyzed</span>
// // //           <span className="stat-value">{summary.total_uploads_analyzed}</span>
// // //         </div>
// // //         <div className="stat-card">
// // //           <span className="stat-label">Average comfort score</span>
// // //           <span className="stat-value">{summary.average_comfort_score}/100</span>
// // //         </div>
// // //       </div>

// // //       <div className="chart-grid">
// // //         <div className="chart-card">
// // //           <h3>Room types analyzed</h3>
// // //           <Bar data={toChartData(summary.room_type_breakdown, "Rooms", "#6C63FF")} />
// // //         </div>
// // //         <div className="chart-card">
// // //           <h3>Styles detected</h3>
// // //           <Bar data={toChartData(summary.style_breakdown, "Styles", "#22A699")} />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useState } from "react";
// // import { Bar } from "react-chartjs-2";
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";
// // import { getSummary } from "../api/spacecraft";
// // import { useCountUp } from "../hooks/useCountUp";

// // ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// // const CHART_COLORS = ["#c79a56", "#7c9885", "#1b2430", "#a97e3e", "#5f7a68", "#c24a3b"];

// // function toChartData(breakdown, label) {
// //   const labels = Object.keys(breakdown);
// //   const values = Object.values(breakdown);
// //   return {
// //     labels,
// //     datasets: [
// //       {
// //         label,
// //         data: values,
// //         backgroundColor: labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
// //         borderRadius: 3,
// //       },
// //     ],
// //   };
// // }

// // const chartOptions = {
// //   responsive: true,
// //   plugins: { legend: { display: false } },
// //   animation: { duration: 700, easing: "easeOutCubic" },
// //   scales: {
// //     y: { beginAtZero: true, ticks: { font: { family: "IBM Plex Mono", size: 11 } } },
// //     x: { ticks: { font: { family: "Inter", size: 11 } } },
// //   },
// // };

// // function CountStat({ label, value, suffix = "" }) {
// //   const animated = useCountUp(value);
// //   const display = Number.isInteger(value) ? Math.round(animated) : animated.toFixed(1);
// //   return (
// //     <div className="stat-card">
// //       <span className="stat-label">{label}</span>
// //       <span className="stat-value" data-counting="true">{display}{suffix}</span>
// //     </div>
// //   );
// // }

// // export default function Dashboard() {
// //   const [summary, setSummary] = useState(null);
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     async function load() {
// //       try {
// //         const data = await getSummary();
// //         setSummary(data);
// //       } catch (err) {
// //         setError(err.response?.data?.detail || "Could not load dashboard.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     load();
// //   }, []);

// //   if (loading) return <div className="page">Loading dashboard...</div>;
// //   if (error) return <div className="page"><div className="error-banner">{error}</div></div>;
// //   if (!summary || summary.total_uploads_analyzed === 0) {
// //     return (
// //       <div className="page">
// //         <h1>Dashboard</h1>
// //         <p className="subtitle">No analyses yet — every insight here builds from rooms you upload.</p>
// //       </div>
// //     );
// //   }

// //   const roomTypeCount = Object.keys(summary.room_type_breakdown).length;
// //   const styleCount = Object.keys(summary.style_breakdown).length;
// //   const topRoom = Object.entries(summary.room_type_breakdown).sort((a, b) => b[1] - a[1])[0];
// //   const topStyle = Object.entries(summary.style_breakdown).sort((a, b) => b[1] - a[1])[0];

// //   return (
// //     <div className="page">
// //       <h1>Dashboard</h1>
// //       <p className="subtitle">A running record of every room SpaceCraft has analyzed for you.</p>

// //       <div className="stat-grid">
// //         <CountStat label="Rooms analyzed" value={summary.total_uploads_analyzed} />
// //         <CountStat label="Avg. comfort score" value={summary.average_comfort_score} suffix="/100" />
// //         <CountStat label="Room types seen" value={roomTypeCount} />
// //         <CountStat label="Styles detected" value={styleCount} />
// //         <div className="stat-card">
// //           <span className="stat-label">Most common room</span>
// //           <span className="stat-value">{topRoom ? topRoom[0].replace("_", " ") : "—"}</span>
// //         </div>
// //         <div className="stat-card">
// //           <span className="stat-label">Most common style</span>
// //           <span className="stat-value">{topStyle ? topStyle[0] : "—"}</span>
// //         </div>
// //       </div>

// //       <div className="chart-grid">
// //         <div className="chart-card">
// //           <h3>Room types analyzed</h3>
// //           <Bar data={toChartData(summary.room_type_breakdown, "Rooms")} options={chartOptions} />
// //         </div>
// //         <div className="chart-card">
// //           <h3>Styles detected</h3>
// //           <Bar data={toChartData(summary.style_breakdown, "Styles")} options={chartOptions} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { getSummary } from "../api/spacecraft";
// import { useCountUp } from "../hooks/useCountUp";
// import ComfortRing from "../components/ComfortRing";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// const CHART_COLORS = ["#c9603f", "#2f8f83", "#c79a56", "#a85275", "#4a5b8c", "#7c9885"];

// function toChartData(breakdown, label) {
//   const labels = Object.keys(breakdown);
//   const values = Object.values(breakdown);
//   return {
//     labels,
//     datasets: [
//       {
//         label,
//         data: values,
//         backgroundColor: labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
//         borderRadius: 3,
//       },
//     ],
//   };
// }

// const chartOptions = {
//   responsive: true,
//   plugins: { legend: { display: false } },
//   animation: { duration: 700, easing: "easeOutCubic" },
//   scales: {
//     y: { beginAtZero: true, ticks: { font: { family: "IBM Plex Mono", size: 11 } } },
//     x: { ticks: { font: { family: "Inter", size: 11 } } },
//   },
// };

// function CountStat({ label, value, suffix = "" }) {
//   const animated = useCountUp(value);
//   const display = Number.isInteger(value) ? Math.round(animated) : animated.toFixed(1);
//   return (
//     <div className="stat-card">
//       <span className="stat-label">{label}</span>
//       <span className="stat-value" data-counting="true">{display}{suffix}</span>
//     </div>
//   );
// }

// export default function Dashboard() {
//   const [summary, setSummary] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await getSummary();
//         setSummary(data);
//       } catch (err) {
//         setError(err.response?.data?.detail || "Could not load dashboard.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   if (loading) return <div className="page">Loading dashboard...</div>;
//   if (error) return <div className="page"><div className="error-banner">{error}</div></div>;
//   if (!summary || summary.total_uploads_analyzed === 0) {
//     return (
//       <div className="page">
//         <h1>Dashboard</h1>
//         <p className="subtitle">No analyses yet — every insight here builds from rooms you upload.</p>
//       </div>
//     );
//   }

//   const roomTypeCount = Object.keys(summary.room_type_breakdown).length;
//   const styleCount = Object.keys(summary.style_breakdown).length;
//   const topRoom = Object.entries(summary.room_type_breakdown).sort((a, b) => b[1] - a[1])[0];
//   const topStyle = Object.entries(summary.style_breakdown).sort((a, b) => b[1] - a[1])[0];

//   return (
//     <div className="page">
//       <h1>Dashboard</h1>
//       <p className="subtitle">A running record of every room SpaceCraft has analyzed for you.</p>

//       <div className="stat-grid">
//         <CountStat label="Rooms analyzed" value={summary.total_uploads_analyzed} />
//         <div className="stat-card comfort-ring-card">
//           <span className="stat-label">Avg. comfort score</span>
//           <ComfortRing value={summary.average_comfort_score} color="#c9603f" />
//         </div>
//         <CountStat label="Room types seen" value={roomTypeCount} />
//         <CountStat label="Styles detected" value={styleCount} />
//         <div className="stat-card">
//           <span className="stat-label">Most common room</span>
//           <span className="stat-value">{topRoom ? topRoom[0].replace("_", " ") : "—"}</span>
//         </div>
//         <div className="stat-card">
//           <span className="stat-label">Most common style</span>
//           <span className="stat-value">{topStyle ? topStyle[0] : "—"}</span>
//         </div>
//       </div>

//       <div className="chart-grid">
//         <div className="chart-card">
//           <h3>Room types analyzed</h3>
//           <Bar data={toChartData(summary.room_type_breakdown, "Rooms")} options={chartOptions} />
//         </div>
//         <div className="chart-card">
//           <h3>Styles detected</h3>
//           <Bar data={toChartData(summary.style_breakdown, "Styles")} options={chartOptions} />
//         </div>
//       </div>
//     </div>
//   );
// }