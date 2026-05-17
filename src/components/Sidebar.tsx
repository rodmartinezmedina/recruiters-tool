"use client";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: "Home", active: false },
  { label: "Search", active: true },
  { label: "Pipeline", active: false },
  { label: "Candidates", active: false },
  { label: "Analytics", active: false },
];

export default function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <aside
      className={`h-full bg-white border-r border-border flex flex-col shrink-0 transition-[width] duration-200 ${
        collapsed ? "w-14" : "w-60"
      }`}
    >
      <div
        className={`pt-3 pb-2 flex items-center ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded bg-accent shrink-0" />
            <span className="text-sm font-semibold text-text-primary truncate">
              Foundernest
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-8 h-8 rounded-md text-text-secondary hover:text-text-primary hover:bg-chip-bg border border-border bg-white flex items-center justify-center transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d={collapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {collapsed && (
        <div className="flex justify-center pt-1 pb-2">
          <div className="w-6 h-6 rounded bg-accent" />
        </div>
      )}
      <nav className={`flex-1 py-1 ${collapsed ? "px-2" : "px-2"}`}>
        {navItems.map((item) => (
          <button
            key={item.label}
            title={collapsed ? item.label : undefined}
            className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors ${
              collapsed ? "justify-center px-2 py-2" : "gap-3 px-4 py-2.5"
            } ${
              item.active
                ? "bg-accent-light text-accent"
                : "text-text-secondary hover:bg-chip-bg"
            }`}
          >
            <div
              className={`w-5 h-5 rounded shrink-0 ${
                item.active ? "bg-accent" : "bg-border"
              }`}
            />
            {!collapsed && item.label}
          </button>
        ))}
      </nav>
      <div
        className={`py-3 border-t border-border flex items-center ${
          collapsed ? "justify-center px-2" : "gap-3 px-4"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-border shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Rodrigo M.</p>
            <p className="text-xs text-text-secondary truncate">recruiter@co.com</p>
          </div>
        )}
      </div>
    </aside>
  );
}
