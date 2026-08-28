const ROOM_ICONS = {
  bedroom: "🛏️",
  kitchen: "🍳",
  living_room: "🛋️",
  office: "💼",
};

export function getRoomIcon(roomType) {
  return ROOM_ICONS[roomType] || "🏠";
}