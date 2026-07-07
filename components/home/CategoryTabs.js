"use client";

const CATEGORIES = [
  { id: "all", label: "All Games", icon: "/icons/all-games.png" },
  { id: "popular", label: "Popular", icon: "/icons/popular.png" },
  { id: "lottery", label: "Lottery", icon: "/icons/lottery.png" },
  { id: "slots", label: "Slots", icon: "/icons/slots.png" },
  { id: "live", label: "Live Casino", icon: "/icons/live-casino.png" },
  { id: "sports", label: "Sports", icon: "/icons/sports.png" },
  { id: "mini", label: "Mini Games", icon: "/icons/mini-games.png" },
];

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="club-categories">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`club-category-tab ${active === cat.id ? "active" : ""}`}
          onClick={() => onChange(cat.id)}
        >
          <span className="club-category-icon-wrap">
            <img
              src={cat.icon}
              alt={cat.label}
              className="club-category-icon"
            />
          </span>

          <span className="club-category-label">
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
}
