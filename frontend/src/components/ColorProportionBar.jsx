export default function ColorProportionBar({ colors, percentages }) {
  if (!colors || colors.length === 0) return null;

  // Fall back to equal widths if no real percentages are available
  // (e.g. older records saved before this feature existed)
  const hasRealPercentages = percentages && percentages.length === colors.length;
  const widths = hasRealPercentages
    ? percentages
    : colors.map(() => 100 / colors.length);

  return (
    <div>
      <div className="color-bar">
        {colors.map((hex, i) => (
          <div
            key={hex + i}
            className="color-bar-segment"
            style={{ width: `${widths[i]}%`, backgroundColor: hex, animationDelay: `${i * 0.1}s` }}
            title={hex}
          />
        ))}
      </div>
      <div className="color-legend">
        {colors.map((hex, i) => (
          <div key={hex + i} className="color-legend-item" style={{ animationDelay: `${0.5 + i * 0.05}s` }}>
            <span className="color-legend-dot" style={{ backgroundColor: hex }} />
            <span className="color-legend-text">
              {hex}
              {hasRealPercentages ? ` · ${widths[i]}%` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}