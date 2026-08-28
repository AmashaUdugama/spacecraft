import { useEffect, useState } from "react";

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ComfortRing({ value, max = 100, color = "#c9603f" }) {
  const [animatedOffset, setAnimatedOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    const pct = Math.max(0, Math.min(1, value / max));
    const targetOffset = CIRCUMFERENCE - pct * CIRCUMFERENCE;
    // small delay so the draw-in animation is visible even on fast loads
    const t = setTimeout(() => setAnimatedOffset(targetOffset), 80);
    return () => clearTimeout(t);
  }, [value, max]);

  return (
    <svg width="120" height="120" viewBox="0 0 80 80" className="comfort-ring">
      <circle cx="40" cy="40" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="7" />
      <circle
        cx="40"
        cy="40"
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={animatedOffset}
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.3,1)" }}
      />
      <text x="40" y="37" textAnchor="middle" className="comfort-ring-value">
        {Math.round(value)}
      </text>
      <text x="40" y="50" textAnchor="middle" className="comfort-ring-max">
        / {max}
      </text>
    </svg>
  );
}