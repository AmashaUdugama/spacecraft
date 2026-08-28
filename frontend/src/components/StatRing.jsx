import { useEffect, useState } from "react";

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StatRing({ value, color, suffix = "", size = 72 }) {
  const [animatedOffset, setAnimatedOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    const pct = Math.max(0, Math.min(1, value / 100));
    const targetOffset = CIRCUMFERENCE - pct * CIRCUMFERENCE;
    const t = setTimeout(() => setAnimatedOffset(targetOffset), 80);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className="stat-ring">
      <circle cx="40" cy="40" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="6" />
      <circle
        cx="40"
        cy="40"
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={animatedOffset}
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.3,1)" }}
      />
      <text x="40" y="46" textAnchor="middle" className="stat-ring-value">
        {Math.round(value)}{suffix}
      </text>
    </svg>
  );
}