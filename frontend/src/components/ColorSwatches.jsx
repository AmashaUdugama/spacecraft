export default function ColorSwatches({ colors }) {
  if (!colors || colors.length === 0) return null;
  return (
    <div className="swatch-row">
      {colors.map((hex) => (
        <div key={hex} className="swatch" style={{ backgroundColor: hex }} title={hex}>
          <span className="swatch-label">{hex}</span>
        </div>
      ))}
    </div>
  );
}
