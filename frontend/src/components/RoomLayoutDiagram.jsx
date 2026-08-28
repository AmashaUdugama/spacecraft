// Furniture placement templates per room type. Each slot is a keyword to
// match against a recommendation's title, plus a position/size in a 300x220
// room diagram (in SVG units). Only slots with a matching real recommendation
// get drawn - this stays a genuine reflection of the actual data, not a
// generic stock illustration.
const ROOM_TEMPLATES = {
  bedroom: [
    { slot: "bed", keywords: ["bed"], x: 90, y: 100, w: 140, h: 90 },
    { slot: "nightstand", keywords: ["nightstand", "bedside"], x: 20, y: 110, w: 50, h: 40 },
    { slot: "wardrobe", keywords: ["wardrobe"], x: 20, y: 20, w: 60, h: 40 },
    { slot: "mirror", keywords: ["mirror"], x: 250, y: 20, w: 30, h: 40 },
  ],
  living_room: [
    { slot: "sofa", keywords: ["sofa"], x: 30, y: 130, w: 160, h: 55 },
    { slot: "coffee_table", keywords: ["coffee", "center table"], x: 90, y: 60, w: 70, h: 45 },
    { slot: "shelf", keywords: ["shelf", "shelving"], x: 220, y: 20, w: 60, h: 150 },
  ],
  kitchen: [
    { slot: "cabinet", keywords: ["cabinet", "pantry", "cupboard"], x: 20, y: 20, w: 200, h: 45 },
    { slot: "island", keywords: ["island"], x: 90, y: 110, w: 100, h: 50 },
    { slot: "light", keywords: ["pendant", "lighting"], x: 130, y: 60, w: 20, h: 20 },
  ],
  office: [
    { slot: "desk", keywords: ["desk"], x: 40, y: 30, w: 120, h: 50 },
    { slot: "chair", keywords: ["chair"], x: 70, y: 90, w: 45, h: 45 },
    { slot: "shelf", keywords: ["shelf", "storage"], x: 220, y: 20, w: 60, h: 150 },
  ],
};

function matchItemToSlot(items, keywords) {
  return items.find((item) =>
    keywords.some((kw) => item.title.toLowerCase().includes(kw))
  );
}

export default function RoomLayoutDiagram({ roomType, dominantColors, recommendationItems }) {
  const template = ROOM_TEMPLATES[roomType];
  const furnitureItems = (recommendationItems || []).filter((i) => i.category === "furniture");

  if (!template || furnitureItems.length === 0 || !dominantColors || dominantColors.length === 0) {
    return null;
  }

  const placedSlots = template
    .map((slot) => ({ ...slot, item: matchItemToSlot(furnitureItems, slot.keywords) }))
    .filter((slot) => slot.item);

  if (placedSlots.length === 0) return null;

  return (
    <div className="layout-diagram-wrap">
      <svg viewBox="0 0 300 220" className="layout-diagram-svg">
        <rect x="4" y="4" width="292" height="212" fill="none" stroke="var(--line)" strokeWidth="3" rx="2" />
        {placedSlots.map((slot, i) => (
          <g key={slot.slot}>
            <rect
              x={slot.x}
              y={slot.y}
              width={slot.w}
              height={slot.h}
              rx="3"
              fill={dominantColors[i % dominantColors.length]}
              stroke="rgba(27,36,48,0.25)"
              strokeWidth="1"
              className="layout-block"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          </g>
        ))}
      </svg>
      <div className="layout-legend">
        {placedSlots.map((slot, i) => (
          <div key={slot.slot} className="layout-legend-item" style={{ animationDelay: `${0.4 + i * 0.08}s` }}>
            <span className="layout-legend-dot" style={{ backgroundColor: dominantColors[i % dominantColors.length] }} />
            <span>{slot.item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}