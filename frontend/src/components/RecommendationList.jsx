export default function RecommendationList({ items }) {
  if (!items || items.length === 0) return <p>No recommendations available.</p>;

  return (
    <div className="recommend-grid">
      {items.map((item, idx) => (
        <div key={idx} className="recommend-card">
          <span className={`badge badge-${item.category}`}>{item.category}</span>
          <h4>{item.title}</h4>
          <p>{item.description}</p>
          {item.estimated_price_range && <span className="price-tag">{item.estimated_price_range}</span>}
        </div>
      ))}
    </div>
  );
}
