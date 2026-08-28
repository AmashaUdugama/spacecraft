// const CATEGORY_COLORS = {
//   furniture: "#c79a56",
//   color: "#a85275",
//   layout: "#7c9885",
//   decor: "#4a5b8c",
// };

// export default function RecommendationTable({ items }) {
//   if (!items || items.length === 0) return <p>No recommendations available.</p>;

//   return (
//     <div className="recommend-table-wrap">
//       <table className="recommend-table">
//         <thead>
//           <tr>
//             <th>Category</th>
//             <th>Item</th>
//             <th>Why</th>
//             <th className="align-right">Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item, idx) => (
//             <tr key={idx} style={{ animationDelay: `${idx * 0.08}s` }}>
//               <td>
//                 <span
//                   className="badge"
//                   style={{ background: CATEGORY_COLORS[item.category] || "var(--ink)" }}
//                 >
//                   {item.category}
//                 </span>
//               </td>
//               <td className="recommend-table-item">{item.title}</td>
//               <td className="recommend-table-why">{item.description}</td>
//               <td className="align-right recommend-table-price">
//                 {item.estimated_price_range || "—"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
const CATEGORY_COLORS = {
  furniture: "#c79a56",
  color: "#a85275",
  layout: "#7c9885",
  decor: "#4a5b8c",
};

export default function RecommendationTable({ items }) {
  if (!items || items.length === 0) return <p>No recommendations available.</p>;

  return (
    <div className="recommend-table-wrap">
      <table className="recommend-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Item</th>
            <th>Why</th>
            <th className="align-right">Est. price (LKR)</th>
            <th className="align-center">Budget</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} style={{ animationDelay: `${idx * 0.08}s` }}>
              <td>
                <span
                  className="badge"
                  style={{ background: CATEGORY_COLORS[item.category] || "var(--ink)" }}
                >
                  {item.category}
                </span>
              </td>
              <td className="recommend-table-item">{item.title}</td>
              <td className="recommend-table-why">{item.description}</td>
              <td className="align-right recommend-table-price">
                {item.estimated_price_range || "—"}
              </td>
              <td className="align-center">
                {item.fits_budget === true && <span title="Within your budget">✅</span>}
                {item.fits_budget === false && <span title="Above your stated budget" style={{ opacity: 0.6 }}>⚠️</span>}
                {item.fits_budget === null && <span style={{ color: "var(--text-muted)" }}>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}