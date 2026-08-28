// import { useEffect, useState } from "react";
// import { getHistory } from "../api/spacecraft";
// import ColorProportionBar from "../components/ColorProportionBar";

// export default function History() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await getHistory();
//         setItems(data);
//       } catch (err) {
//         setError(err.response?.data?.detail || "Could not load history.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   if (loading) return <div className="page">Loading history...</div>;

//   return (
//     <div className="page">
//       <h1>Your history</h1>
//       {error && <div className="error-banner">{error}</div>}
//       {items.length === 0 && !error && <p>No analyses yet. Go upload a room photo!</p>}

//       <div className="history-list">
//         {items.map((item) => (
//           <div key={item.id} className="history-card">
//             <div className="history-header">
//               <strong>{item.room_type.replace("_", " ")}</strong>
//               <span className="badge">{item.style}</span>
//               <span className="history-date">{new Date(item.created_at).toLocaleString()}</span>
//             </div>
//             <div className="history-body">
//               <span>Comfort: {Math.round(item.comfort_score)}/100</span>
//               <span>Movement: {Math.round(item.movement_efficiency)}/100</span>
//               <span>Balance: {Math.round(item.layout_balance)}/100</span>
//             </div>
//             <ColorProportionBar
//               colors={item.dominant_colors.split(",")}
//               percentages={item.dominant_color_percentages ? item.dominant_color_percentages.split(",").map(Number) : []}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { getHistory } from "../api/spacecraft";
import ColorProportionBar from "../components/ColorProportionBar";
import LoadingState from "../components/LoadingState";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getHistory();
        setItems(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Could not load history.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingState label="Loading history..." />;

  return (
    <div className="page">
      <h1>Your history</h1>
      {error && <div className="error-banner">{error}</div>}
      {items.length === 0 && !error && <p>No analyses yet. Go upload a room photo!</p>}

      <div className="history-list">
        {items.map((item) => (
          <div key={item.id} className="history-card">
            <div className="history-header">
              <strong>{item.room_type.replace("_", " ")}</strong>
              <span className="badge">{item.style}</span>
              <span className="history-date">{new Date(item.created_at).toLocaleString()}</span>
            </div>
            <div className="history-body">
              <span>Comfort: {Math.round(item.comfort_score)}/100</span>
              <span>Movement: {Math.round(item.movement_efficiency)}/100</span>
              <span>Balance: {Math.round(item.layout_balance)}/100</span>
            </div>
            <ColorProportionBar
              colors={item.dominant_colors.split(",")}
              percentages={item.dominant_color_percentages ? item.dominant_color_percentages.split(",").map(Number) : []}
            />
          </div>
        ))}
      </div>
    </div>
  );
}