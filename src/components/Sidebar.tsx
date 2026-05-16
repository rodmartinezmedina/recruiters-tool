"use client";

const navItems = [
  { label: "Home", active: false },
  { label: "Search", active: true },
  { label: "Pipeline", active: false },
  { label: "Candidates", active: false },
  { label: "Analytics", active: false },
];

export default function Sidebar() {
  return (
    <aside className="w-60 h-full bg-white border-r border-border flex flex-col shrink-0">
      <div className="px-4 py-4 flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-accent" />
        <span className="text-sm font-semibold text-text-primary">Foundernest</span>
      </div>
      <nav className="flex-1 px-2 py-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "bg-accent-light text-accent"
                : "text-text-secondary hover:bg-chip-bg"
            }`}
          >
            <div
              className={`w-5 h-5 rounded ${
                item.active ? "bg-accent" : "bg-border"
              }`}
            />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-border" />
        <div>
          <p className="text-sm font-medium text-text-primary">Rodrigo M.</p>
          <p className="text-xs text-text-secondary">recruiter@co.com</p>
        </div>
      </div>
    </aside>
  );
}
