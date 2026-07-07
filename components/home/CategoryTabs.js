"use client";

const CATEGORIES = [
  { id: "all", label: "All Games", icon: "🍀" },
  { id: "popular", label: "Popular", icon: "🔥" },
  { id: "lottery", label: "Lottery", icon: "🎱" },
  { id: "slots", label: "Slots", icon: "🎰" },
  { id: "live", label: "Live Casino", icon: "🎩" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "mini", label: "Mini Games", icon: "🎮" },
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
            <span className="club-category-icon" aria-hidden="true">
              {cat.icon}
            </span>
          </span>
          <span className="club-category-label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
